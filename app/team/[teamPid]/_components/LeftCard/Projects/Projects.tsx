import LoadingIndicator from "@/components/General/LoadingIndicator";
import { useGetTeamProjectsByTeamPidQuery } from "@/redux/apis/projects.api";
import ProjectLink from "./ProjectLink/ProjectLink";
import { useSearchParams } from "next/navigation";

interface Props {
  teamPid: string;
}

const Projects = ({ teamPid }: Props) => {
  const { data: projectsData, isLoading } = useGetTeamProjectsByTeamPidQuery({
    teamPid,
  });
  const activeProjectId = useSearchParams().get("projectId");
  if (isLoading) return <LoadingIndicator />;
  const { projects } = projectsData!;
  return (
    <div className="flex flex-col gap-2">
      {projects.map((project) => (
        <ProjectLink
          key={project.id}
          project={project}
          activeProjectId={activeProjectId}
        />
      ))}
    </div>
  );
};
export default Projects;
