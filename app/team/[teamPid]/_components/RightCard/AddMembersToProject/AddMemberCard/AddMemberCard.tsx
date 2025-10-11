import { Button } from "@/components/ui/button";
import { useAddMemberToProjectByProjectPidMutation } from "@/redux/apis/projects.api";
import { CheckIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  projectPid: string;
  username: string;
  userId: number;
}

const AddMemberCard = ({ projectPid, userId, username }: Props) => {
  const [addMember] = useAddMemberToProjectByProjectPidMutation();
  const [invited, setInvited] = useState(false);
  const onAdd = async (userId: number) => {
    try {
      await addMember({ projectPid, userId });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex items-center gap-2 border-b-2">
      <span>{username}</span>
      <Button
        variant={"inverse"}
        disabled={invited}
        onClick={() => {
          setInvited(true);
          onAdd(userId);
        }}
        className="shrink-0 ml-auto"
      >
        {invited ? (
          <CheckIcon className="size-7" />
        ) : (
          <PlusCircleIcon className="size-7" />
        )}
      </Button>
    </div>
  );
};
export default AddMemberCard;
