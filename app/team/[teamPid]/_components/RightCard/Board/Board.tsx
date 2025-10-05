import type { ProjectType } from "@/lib/types";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import type { Column } from "@prisma/client";
import BoardColumn from "./BoardColumn/BoardColumn";
import { useReorderProjectColumnsMutation } from "@/redux/apis/projects.api";

interface Props {
  project: ProjectType;
}

const Board = ({ project }: Props) => {
  const [columns, setColumns] = useState<Column[]>(project.Column ?? []);
  useEffect(() => {
    setColumns(project.Column.slice().sort((a, b) => a.index - b.index));
  }, [project.Column]);

  const [reorderCols] = useReorderProjectColumnsMutation();

  const handleDragEnd = async (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id == over.id) return;

    const oldIndex = columns.findIndex((c) => c.id === active.id);
    const newIndex = columns.findIndex((c) => c.id === over.id);
    const reordered = arrayMove(columns, oldIndex, newIndex);

    setColumns(reordered);
    await reorderCols({
      projectPid: project.projectPid,
      newColumns: reordered.map((c) => c.id),
    });
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto">
        <SortableContext items={columns.map((c) => c.id)}>
          {columns
            .slice()
            .sort((a, b) => b.index - a.index)
            .map((col) => (
              <BoardColumn
                key={col.id}
                column={col}
                projectPid={project.projectPid}
              />
            ))}
        </SortableContext>
      </div>
    </DndContext>
  );
};
export default Board;
