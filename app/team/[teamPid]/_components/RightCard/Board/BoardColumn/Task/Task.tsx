import { buttonVariants } from "@/components/ui/button";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "@prisma/client";

interface Props {
  task: Task;
}

const Task = ({ task }: Props) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.taskPid,
    data: { type: "Task", task },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging)
    return (
      <div className="border-1 opacity-25" ref={setNodeRef} style={style}>
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
  return (
    <div className="border-1" ref={setNodeRef} style={style}>
      {task.title} - {task.index}
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
