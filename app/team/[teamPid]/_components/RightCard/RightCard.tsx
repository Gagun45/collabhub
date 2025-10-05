import LoadingIndicator from "@/components/General/LoadingIndicator";
import { Card, CardContent } from "@/components/ui/card";
import { useGetProjectByProjectPidQuery } from "@/redux/apis/projects.api";
import { useSearchParams } from "next/navigation";
import Board from "./Board/Board";
import AddColumnBtn from "./AddColumnBtn/AddColumnBtn";

const RightCard = () => {
  const projectPid = useSearchParams().get("projectPid");
  const { data, isLoading, error, isError } = useGetProjectByProjectPidQuery(
    { projectPid: projectPid ?? "" },
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

  if (!data)
    return (
      <Card className="w-full">
        <CardContent className="space-y-4">Choose a project</CardContent>
      </Card>
    );

  const project = data.project;
  return (
    <Card className="w-full">
      <CardContent className="space-y-4">
        <h2>{project?.title}</h2>
        <AddColumnBtn projectPid={project!.projectPid} />
        <Board project={project!} />
      </CardContent>
    </Card>
  );
};
export default RightCard;
