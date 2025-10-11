import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateNewTaskMutation } from "@/redux/apis/kanban.api";
import { useState } from "react";
import { useProjectPid } from "../../../../ProjectPidContext";

interface Props {
  columnPid: string;
}

const AddTaskBtn = ({ columnPid }: Props) => {
  const projectPid = useProjectPid();
  const [newTask, setNewTask] = useState("");
  const [createTask] = useCreateNewTaskMutation();
  const onAddNewTask = async () => {
    if (!newTask) return;
    createTask({
      columnPid,
      taskTitle: newTask,
      projectPid,
    });
    setNewTask("");
  };
  return (
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
  );
};
export default AddTaskBtn;
