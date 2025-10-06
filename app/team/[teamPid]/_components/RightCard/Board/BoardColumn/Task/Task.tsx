import { buttonVariants } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@prisma/client";

interface Props {
  task: Task;
  columnPid: string;
}

const Task = ({ task, columnPid }: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.taskPid,
    data: { type: "Task", columnPid },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div className="border-1" ref={setNodeRef} style={style}>
      {task.title}

      <span
        {...listeners}
        {...attributes}
        className={buttonVariants({ variant: "primary" })}
      >
        Move
      </span>
    </div>
  );
};
export default Task;
