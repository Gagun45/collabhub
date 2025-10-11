import LoadingIndicator from "@/components/General/LoadingIndicator";
import { useGetTeamProjectsByTeamPidQuery } from "@/redux/apis/projects.api";
import ProjectLink from "./ProjectLink/ProjectLink";
import { usePidContext } from "../../ProjectPidContext";


const Projects = () => {
  const {teamPid} = usePidContext()
  const { data: projectsData, isLoading } = useGetTeamProjectsByTeamPidQuery({
    teamPid,
  });
  if (isLoading) return <LoadingIndicator/>;
  const { projects } = projectsData!;
  return (
    <div className="flex flex-col gap-4">
      {projects.length === 0 && <span className="text-center">The team has no projects yet!</span>}
      {projects.map((project) => (
        <ProjectLink
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
};
export default Projects;
