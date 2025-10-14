import LoadingIndicator from "@/components/General/LoadingIndicator";
import { useGetTeamProjectsByTeamPidQuery } from "@/redux/apis/projects.api";
import { usePidContext } from "../../ProjectPidContext";
import DesktopProjects from "./DesktopProjects/DesktopProjects";
import MobileProjects from "./MobileProjects/MobileProjects";

const Projects = () => {
  const { teamPid } = usePidContext();
  const { data: projectsData, isLoading } = useGetTeamProjectsByTeamPidQuery({
    teamPid,
  });
  if (isLoading) return <LoadingIndicator />;
  const { projects } = projectsData!;
  return (
    <>
      <MobileProjects projects={projects} />
      <DesktopProjects projects={projects} />
    </>
  );
};
export default Projects;
