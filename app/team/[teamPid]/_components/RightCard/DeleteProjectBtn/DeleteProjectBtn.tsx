import { Button } from "@/components/ui/button";
import { useDeleteProjectMutation } from "@/redux/apis/projects.api";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  projectPid: string;
}

const DeleteProjectBtn = ({ projectPid }: Props) => {
  const [deleteProject] = useDeleteProjectMutation();
  const router = useRouter();
  const onDeleteProject = async () => {
    try {
      await deleteProject({ projectPid }).unwrap();
      router.push("/my-teams");
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <Button
      onClick={onDeleteProject}
      variant={"destructive"}
      className="ml-auto"
    >
      Delete project
    </Button>
  );
};
export default DeleteProjectBtn;
