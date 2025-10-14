import type { Project } from "@prisma/client";
import ProjectLink from "../ProjectLink/ProjectLink";

interface Props {
  projects: Project[];
}

const DesktopProjects = ({ projects }: Props) => {
  return (
    <div className="hidden xl:flex flex-col gap-4">
      {projects.length === 0 && (
        <span className="italic">The team has no projects yet!</span>
      )}
      {projects.map((project) => (
        <ProjectLink key={project.id} project={project} />
      ))}
    </div>
  );
};
export default DesktopProjects;
