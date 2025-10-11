import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreateNewColumnMutation } from "@/redux/apis/kanban.api";
import { useState } from "react";
import { usePidContext } from "../../ProjectPidContext";

const AddColumnBtn = () => {
  const { projectPid } = usePidContext();
  const [newTitle, setNewTitle] = useState("");
  const [createColumn] = useCreateNewColumnMutation();

  const onCreate = async () => {
    if (!newTitle) return;
    createColumn({ projectPid, title: newTitle });
    setNewTitle("");
  };

  return (
    <form
      className="flex gap-4 max-w-md"
      onSubmit={(e) => {
        e.preventDefault();
        onCreate();
      }}
    >
      <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      <Button disabled={!newTitle}>Add column</Button>
    </form>
  );
};
export default AddColumnBtn;
