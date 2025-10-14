import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useDeleteMemberFromProjectMutation } from "@/redux/apis/projects.api";
import { useState } from "react";
import { usePidContext } from "../../../ProjectPidContext";
import { toast } from "sonner";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";

interface Props {
  userId: number;
}

const RemoveMemberFromProject = ({ userId }: Props) => {
  const { projectPid } = usePidContext();
  const [loading, setLoading] = useState(false);
  const [removeMember] = useDeleteMemberFromProjectMutation();
  const onRemove = async () => {
    setLoading(true);
    try {
      await removeMember({ projectPid, userId }).unwrap();
    } catch {
      toast.error(UNEXPECTED_ERROR);
      setLoading(false);
    }
  };
  return (
    <DropdownMenuItem disabled={loading} asChild>
      <AlertDialog>
        <AlertDialogTrigger
          className={`${buttonVariants({
            variant: "ghost",
          })} text-destructive hover:text-destructive`}
        >
          {loading ? "Loading..." : "Remove from project"}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove user from the project?</AlertDialogTitle>
            <AlertDialogDescription>
              Once confirmed, this action cannot be reversed. It will delete
              your account and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction variant={"destructive"} onClick={onRemove}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DropdownMenuItem>
  );
};
export default RemoveMemberFromProject;
