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
  // useEffect(() => {
  //   setColumns(project.Column.slice().sort((a, b) => a.index - b.index));
  //   setTasks(project.Column.flatMap((c) => c.Task));
  // }, [project.Column]);

  const [reorderCols] = useReorderProjectColumnsMutation();

  const onDragEnd = (e: DragEndEvent) => {
    setActiveTask(null);
    setActiveColumn(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;

    setColumns((prev) => {
      const oldIndex = columns.findIndex((c) => c.columnPid === active.id);
      const newIndex = columns.findIndex((c) => c.columnPid === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
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
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        <SortableContext items={columns.map((c) => c.columnPid)}>
          {columns
            .slice()
            // .sort((a, b) => b.index - a.index)
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
