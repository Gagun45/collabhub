import LoadingIndicator from "@/components/General/LoadingIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProjectByProjectPidQuery } from "@/redux/apis/projects.api";
import ProjectCard from "./ProjectCard";
import { usePidContext } from "../ProjectPidContext";

const RightCard = () => {
  const { projectPid } = usePidContext();
  const { data, isLoading, error, isError } = useGetProjectByProjectPidQuery(
    { projectPid },
    { skip: !projectPid }
  );

  if (isLoading)
    return (
      <Card className="w-full">
        <CardContent className="space-y-4">
          <LoadingIndicator />
        </CardContent>
      </Card>
    );

  if (isError)
    return (
      <Card className="w-full">
        <CardContent className="space-y-4">{error as string}</CardContent>
      </Card>
    );

  if (!data || !data.project || !data.role)
    return (
      <Card className="w-full">
        <CardContent className="space-y-4">Choose a project</CardContent>
      </Card>
    );

  const { project, role } = data;

  return <ProjectCard project={project} role={role} />;
};
export default RightCard;
