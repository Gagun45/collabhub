import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import { useCreateNewColumnMutation } from "@/redux/apis/projects.api";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  projectPid: string;
}

const AddColumnBtn = ({ projectPid }: Props) => {
  const [newTitle, setNewTitle] = useState("");
  const [createColumn, { isLoading, isError }] = useCreateNewColumnMutation();

  const onCreate = async () => {
    if (!newTitle) return;
    await createColumn({ projectPid, title: newTitle });
    setNewTitle("");
  };

  if (isError) {
    toast.error(UNEXPECTED_ERROR);
  }

  return (
    <div className="flex gap-4">
      <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      <Button disabled={!newTitle || isLoading} onClick={onCreate}>
        {isLoading ? "Loading..." : "Add column"}
      </Button>
    </div>
  );
};
export default AddColumnBtn;
