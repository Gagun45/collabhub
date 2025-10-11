import LoadingIndicator from "@/components/General/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import { useAddMemberToProjectByProjectPidMutation } from "@/redux/apis/projects.api";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  projectPid: string;
  username: string;
  userId: number;
}

const AddMemberCard = ({ projectPid, userId, username }: Props) => {
  const [addMember] = useAddMemberToProjectByProjectPidMutation();
  const [loading, setLoading] = useState(false);
  const onAdd = async (userId: number) => {
    try {
      await addMember({ projectPid, userId }).unwrap();
    } catch {
      toast.error(UNEXPECTED_ERROR);
      setLoading(false);
    }
  };
  return (
    <div className="flex items-center gap-2 border-b-2">
      <span>{username}</span>
      <Button
        variant={"inverse"}
        disabled={loading}
        onClick={() => {
          setLoading(true);
          onAdd(userId);
        }}
        className="shrink-0 ml-auto"
      >
        {loading ? (
          <LoadingIndicator className="size-7" />
        ) : (
          <PlusCircleIcon className="size-7" />
        )}
      </Button>
    </div>
  );
};
export default AddMemberCard;
