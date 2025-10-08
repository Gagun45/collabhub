import { Button } from "@/components/ui/button";
import type { Column, Task as TaskType } from "@prisma/client";
import Task from "./Task/Task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import {
  useCreateNewTaskMutation,
  useDeleteColumnMutation,
} from "@/redux/apis/projects.api";

interface Props {
  column: Column;
  tasks: TaskType[];
  projectPid: string;
}

const BoardColumn = ({ column, tasks }: Props) => {
  const [newTask, setNewTask] = useState("");
  const [createTask] = useCreateNewTaskMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  const onAddNewTask = async () => {
    if (!newTask) return;
    createTask({
      columnPid: column.columnPid,
      taskTitle: newTask,
      projectPid: column.projectPid,
    });
    setNewTask("");
  };
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.columnPid,
    data: { type: "Column", column },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };

  if (isDragging)
    return (
      <div
        className="w-80 opacity-35 bg-blue-400 flex flex-col gap-2 shrink-0"
        ref={setNodeRef}
        style={style}
      >
        <span {...attributes} {...listeners} style={{ touchAction: "none" }}>
          {column.title}
        </span>
        <Button
          onClick={() =>
            deleteColumn({
              columnPid: column.columnPid,
              projectPid: column.projectPid,
            })
          }
        >
          Delete column
        </Button>
        <div className="bg-slate-300 py-8 w-full min-h-24">
          <SortableContext items={tasks.map((t) => t.taskPid)}>
            {tasks.map((task) => (
              <Task
                task={task}
                key={task.taskPid}
                projectPid={column.projectPid}
              />
            ))}
          </SortableContext>
        </div>
        <div>
          <Input
            placeholder="Task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={onAddNewTask}>Add task</Button>
        </div>
      </div>
    );
  return (
    <div
      className="w-80 rounded-md flex h-fit flex-col gap-2 pb-2 shrink-0 border-2 overflow-hidden border-blue-400"
      ref={setNodeRef}
      style={style}
    >
      <span
        {...attributes}
        {...listeners}
        style={{ touchAction: "none" }}
        className="bg-blue-400 p-1 text-center"
      >
        {column.title}
      </span>
      <Button
        onClick={() =>
          deleteColumn({
            columnPid: column.columnPid,
            projectPid: column.projectPid,
          })
        }
      >
        Delete column
      </Button>
      <div className="w-full space-y-4 px-4">
        <SortableContext items={tasks.map((t) => t.taskPid)}>
          {tasks.map((task) => (
            <Task
              task={task}
              key={task.taskPid}
              projectPid={column.projectPid}
            />
          ))}
        </SortableContext>
      </div>
      <div className="flex items-center gap-2 px-4">
        <Input
          placeholder="Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button onClick={onAddNewTask}>Add task</Button>
      </div>
    </div>
  );
};
export default BoardColumn;
