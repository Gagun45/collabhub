import { Button } from "@/components/ui/button";
import type { Column, Task as TaskType } from "@prisma/client";
import Task from "./Task/Task";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MoveHorizontalIcon, TrashIcon } from "lucide-react";
import {
  useCreateNewTaskMutation,
  useDeleteColumnMutation,
  useEditColumnTitleMutation,
} from "@/redux/apis/kanban.api";

interface Props {
  column: Column;
  tasks: TaskType[];
  projectPid: string;
}

const BoardColumn = ({ column, tasks }: Props) => {
  const { columnPid, projectPid } = column;
  const [newTask, setNewTask] = useState("");
  const [createTask] = useCreateNewTaskMutation();
  const [deleteColumn] = useDeleteColumnMutation();
  const [title, setTitle] = useState(column.title);
  const [editMode, setEditMode] = useState(false);
  const [editColumnTitle] = useEditColumnTitleMutation();
  const resetTitle = () => {
    setTitle(column.title);
    setEditMode(false);
  };

  const onEditTitle = () => {
    if (!title || title === column.title) {
      resetTitle();
      return;
    }
    editColumnTitle({ columnPid, projectPid, newColumnTitle: title });
    setEditMode(false);
  };

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
        className="w-80 opacity-35 rounded-md flex flex-col gap-2 pb-2 shrink-0 border-2 overflow-hidden border-blue-400"
        ref={setNodeRef}
        style={style}
      >
        <div className="flex items-center bg-blue-400 px-1 py-4 gap-2">
          <Button
            className="size-6 cursor-grab"
            variant={"ghost"}
            {...listeners}
            {...attributes}
            style={{ touchAction: "none" }}
          >
            <MoveHorizontalIcon className="size-4" />
          </Button>
          {editMode ? (
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={resetTitle}
              onKeyDown={(e) => {
                switch (e.key) {
                  case "Escape":
                    resetTitle();
                    break;
                  case "Enter":
                    onEditTitle();
                    break;
                }
              }}
            />
          ) : (
            <span className="break-all" onClick={() => setEditMode(true)}>
              {title}
            </span>
          )}
          <Button
            className="size-8 ml-auto"
            variant={"destructive"}
            onClick={() =>
              deleteColumn({
                columnPid: column.columnPid,
                projectPid: column.projectPid,
              })
            }
          >
            <TrashIcon />
          </Button>
        </div>

        <div className="w-full flex flex-col gap-4 px-4 py-2">
          {tasks.length === 0 && (
            <span className="text-center p-2">No tasks yet!</span>
          )}
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
        <form
          className="flex items-center gap-2 px-4"
          onSubmit={(e) => {
            e.preventDefault();
            onAddNewTask();
          }}
        >
          <Input
            placeholder="Task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button disabled={!newTask}>Add task</Button>
        </form>
      </div>
    );
  return (
    <div
      className="w-80 rounded-md flex flex-col gap-2 pb-2 shrink-0 border-2 overflow-hidden border-blue-400"
      ref={setNodeRef}
      style={style}
    >
      <div className="flex items-center bg-blue-400 px-1 py-4 gap-2">
        <Button
          className="size-6 cursor-grab"
          variant={"ghost"}
          {...listeners}
          {...attributes}
          style={{ touchAction: "none" }}
        >
          <MoveHorizontalIcon className="size-4" />
        </Button>
        {editMode ? (
          <Input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={resetTitle}
            onKeyDown={(e) => {
              switch (e.key) {
                case "Escape":
                  resetTitle();
                  break;
                case "Enter":
                  onEditTitle();
                  break;
              }
            }}
          />
        ) : (
          <span className="break-all" onClick={() => setEditMode(true)}>
            {title}
          </span>
        )}
        <Button
          className="size-8 ml-auto"
          variant={"destructive"}
          onClick={() =>
            deleteColumn({
              columnPid: column.columnPid,
              projectPid: column.projectPid,
            })
          }
        >
          <TrashIcon />
        </Button>
      </div>

      <div className="w-full flex flex-col gap-4 px-4 py-2">
        {tasks.length === 0 && (
          <span className="text-center p-2">No tasks yet!</span>
        )}
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
      <form
        className="flex items-center gap-2 px-4 mt-auto"
        onSubmit={(e) => {
          e.preventDefault();
          onAddNewTask();
        }}
      >
        <Input
          placeholder="Task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <Button disabled={!newTask}>Add task</Button>
      </form>
    </div>
  );
};
export default BoardColumn;
