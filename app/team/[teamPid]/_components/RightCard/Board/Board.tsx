import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import BoardColumn from "./BoardColumn/BoardColumn";
import type { Column, Task as TaskType } from "@prisma/client";
import Task from "./BoardColumn/Task/Task";
import { createPortal } from "react-dom";
import {
  useGetKanbanBoardQuery,
  useReorderProjectColumnsMutation,
  useReorderSingleColumnMutation,
  useReorderTwoColumnsMutation,
} from "@/redux/apis/kanban.api";
import LoadingIndicator from "@/components/General/LoadingIndicator";
import { usePidContext } from "../../ProjectPidContext";

const Board = () => {
  const { projectPid } = usePidContext();
  const { data: board, isLoading } = useGetKanbanBoardQuery({
    projectPid,
  });
  const [columns, setColumns] = useState<Column[]>(board?.columns ?? []);
  const [tasks, setTasks] = useState<TaskType[]>(board?.tasks ?? []);
  useEffect(() => {
    if (!board) return;
    setColumns(board.columns);
    setTasks(board.tasks);
  }, [board]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const [reorderCols] = useReorderProjectColumnsMutation();
  const [reorderSingleCol] = useReorderSingleColumnMutation();
  const [reorderTwoCols] = useReorderTwoColumnsMutation();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor),
    useSensor(TouchSensor, { activationConstraint: { distance: 5 } })
  );
  const onDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);
    setActiveColumn(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === "Column" && overType === "Column") {
      const oldIndex = columns.findIndex((c) => c.columnPid === active.id);
      const newIndex = columns.findIndex((c) => c.columnPid === over.id);
      const reordered = arrayMove(columns, oldIndex, newIndex).map(
        (c, index) => ({ ...c, index: index + 1 })
      );
      setColumns(reordered);
      reorderCols({
        newColumns: reordered.map((c) => c.columnPid),
        projectPid,
      });
    }
    if (activeType === "Task") {
      if (overType === "Task") {
        const toColumnPid = over.data.current?.task.columnPid;

        // REORDER ONE COLUMN //
        if (active.data.current?.task.columnPid === toColumnPid) {
          const oldIndex = tasks.findIndex((t) => t.taskPid === active.id);
          const newIndex = tasks.findIndex((t) => t.taskPid === over.id);
          const reordered = arrayMove(tasks, oldIndex, newIndex);
          const columnCounters: Record<string, number> = {};

          const updated = reordered.map((task) => {
            const index = columnCounters[task.columnPid] ?? 0;
            columnCounters[task.columnPid] = index + 1;
            return { ...task, index: index + 1 };
          });

          const affectedTasksPids = updated
            .filter((t) => t.columnPid === toColumnPid)
            .map((t) => t.taskPid);
          setTasks(updated);
          reorderSingleCol({
            columnPid: toColumnPid,
            projectPid,
            newTasksOrderPids: affectedTasksPids,
          });
        } else {
          // REORDER TWO DIFFERENT COLUMNS
          const fromColumnPid = active.data.current?.task.columnPid;
          const oldIndex = tasks.findIndex((t) => t.taskPid === active.id);
          const newIndex = tasks.findIndex((t) => t.taskPid === over.id);
          const reordered = arrayMove(
            tasks.map((t) =>
              t.taskPid === active.id ? { ...t, columnPid: toColumnPid } : t
            ),
            oldIndex,
            newIndex
          );
          const columnCounters: Record<string, number> = {};

          const updated = reordered.map((task) => {
            const index = columnCounters[task.columnPid] ?? 0;
            columnCounters[task.columnPid] = index + 1;
            return { ...task, index: index + 1 };
          });
          const fromColumnTaskPids = updated
            .filter((t) => t.columnPid === fromColumnPid)
            .map((t) => t.taskPid);
          const toColumnTaskPids = updated
            .filter((t) => t.columnPid === toColumnPid)
            .map((t) => t.taskPid);
          setTasks(updated);
          reorderTwoCols({
            fromColumnPid,
            toColumnPid,
            fromColumnTaskPids,
            toColumnTaskPids,
            projectPid,
          });
        }
      }
      if (overType === "Column") {
        const fromColumnPid = active.data.current?.task.columnPid;
        const toColumnPid = over.data.current?.column.columnPid;
        const oldIndex = tasks.findIndex((t) => t.taskPid === active.id);
        const newIndex = tasks.findIndex((t) => t.taskPid === over.id);
        const reordered = arrayMove(
          tasks.map((t) =>
            t.taskPid === active.id ? { ...t, columnPid: toColumnPid } : t
          ),
          oldIndex,
          newIndex
        );
        const columnCounters: Record<string, number> = {};

        const updated = reordered.map((task) => {
          const index = columnCounters[task.columnPid] ?? 0;
          columnCounters[task.columnPid] = index + 1;
          return { ...task, index: index + 1 };
        });
        const fromColumnTaskPids = updated
          .filter((t) => t.columnPid === fromColumnPid)
          .map((t) => t.taskPid);
        const toColumnTaskPids = updated
          .filter((t) => t.columnPid === toColumnPid)
          .map((t) => t.taskPid);
        setTasks(updated);
        reorderTwoCols({
          fromColumnPid,
          toColumnPid,
          fromColumnTaskPids,
          toColumnTaskPids,
          projectPid,
        });
      }
    }
  };

  const onDragStart = (e: DragStartEvent) => {
    const { active } = e;
    if (active.data.current?.type === "Column") {
      const activeColumn = active.data.current?.column;
      setActiveColumn(activeColumn);
    }
    if (active.data.current?.type === "Task") {
      const activeTask = active.data.current?.task;
      setActiveTask(activeTask);
    }
  };

  if (isLoading) return <LoadingIndicator />;

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      sensors={sensors}
    >
      <div className="flex gap-4 overflow-x-auto">
        {board && board.columns.length === 0 && columns.length === 0 && (
          <span>No columns added yet!</span>
        )}
        <SortableContext items={columns.map((c) => c.columnPid)}>
          {columns
            .slice()
            .sort((a, b) => b.index - a.index)
            .map((col) => (
              <BoardColumn
                key={col.columnPid}
                column={col}
                tasks={tasks
                  .filter((t) => t.columnPid === col.columnPid)
                  .sort((a, b) => b.index - a.index)}
              />
            ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                column={activeColumn}
                tasks={tasks
                  .filter((t) => t.columnPid === activeColumn.columnPid)
                  .sort((a, b) => b.index - a.index)}
              />
            )}
            {activeTask && <Task task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </div>
    </DndContext>
  );
};
export default Board;
