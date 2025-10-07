import type { ProjectType } from "@/lib/types";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import BoardColumn from "./BoardColumn/BoardColumn";
import { useReorderProjectColumnsMutation } from "@/redux/apis/projects.api";
import type { Column, Task as TaskType } from "@prisma/client";
import Task from "./BoardColumn/Task/Task";
import { createPortal } from "react-dom";

interface Props {
  project: ProjectType;
}

const Board = ({ project }: Props) => {
  const [columns, setColumns] = useState<Column[]>(project.Column);
  const [tasks, setTasks] = useState<TaskType[]>(
    project.Column.flatMap((c) => c.Task.map((t) => t))
  );
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  useEffect(() => {
    setColumns(project.Column.slice().sort((a, b) => a.index - b.index));
    setTasks(project.Column.flatMap((c) => c.Task));
  }, [project.Column]);

  const [reorderCols] = useReorderProjectColumnsMutation();

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
        projectPid: project.projectPid,
      });
    }
    if (activeType === "Task") {
      if (overType === "Task") {
        setTasks((prev) => {
          const newColumnPid = over.data.current?.task.columnPid;
          const oldIndex = prev.findIndex((t) => t.taskPid === active.id);
          const newIndex = prev.findIndex((t) => t.taskPid === over.id);

          return arrayMove(
            prev.map((t) =>
              t.taskPid === active.id ? { ...t, columnPid: newColumnPid } : t
            ),
            oldIndex,
            newIndex
          );
        });
      }
      if (overType === "Column") {
        setTasks((prev) =>
          prev.map((t) =>
            t.taskPid === active.id
              ? { ...t, columnPid: over.data.current?.column.columnPid }
              : t
          )
        );
      }
    }
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;

    if (active.data.current?.type !== "Task") return;

    if (!over) return;

    if (over?.data.current?.type === "Column") {
      const dragTask = active.data.current?.task;
      const overColumn = over.data.current?.column;
      if (overColumn.columnPid === active.data.current?.task.columnPid) return;
      setTasks((prev) =>
        prev.map((t) =>
          t.taskPid === dragTask.taskPid
            ? { ...t, columnPid: overColumn.columnPid }
            : t
        )
      );
    }
    if (over?.data.current?.type === "Task") {
      setTasks((prev) => {
        const newColumnPid = over.data.current?.task.columnPid;
        const oldIndex = prev.findIndex((t) => t.taskPid === active.id);
        const newIndex = prev.findIndex((t) => t.taskPid === over.id);

        return arrayMove(
          prev.map((t) =>
            t.taskPid === active.id ? { ...t, columnPid: newColumnPid } : t
          ),
          oldIndex,
          newIndex
        );
      });
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

  return (
    <DndContext
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
      <div className="flex gap-4 overflow-x-auto">
        <SortableContext items={columns.map((c) => c.columnPid)}>
          {columns
            .slice()
            .sort((a, b) => b.index - a.index)
            .map((col) => (
              <BoardColumn
                key={col.columnPid}
                column={col}
                tasks={tasks.filter((t) => t.columnPid === col.columnPid)}
                projectPid={project.projectPid}
              />
            ))}
        </SortableContext>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <BoardColumn
                column={activeColumn}
                projectPid={project.projectPid}
                tasks={tasks.filter(
                  (t) => t.columnPid === activeColumn.columnPid
                )}
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
