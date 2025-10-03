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
  const activeProjectPid = useSearchParams().get("projectPid");
  if (isLoading) return <LoadingIndicator/>;
  const { projects } = projectsData!;
  return (
    <div className="flex flex-col gap-4">
      {projects.length === 0 && <span className="text-center">The team has no projects yet!</span>}
      {projects.map((project) => (
        <ProjectLink
          key={project.id}
          project={project}
          activeProjectPid={activeProjectPid}
        />
      ))}
    </div>
  );
};
export default Projects;
