import type { Project } from "@prisma/client";
import Link from "next/link";
import { usePidContext } from "../../../ProjectPidContext";

interface Props {
  project: Project;
}

const ProjectLink = ({ project }: Props) => {
  const { projectPid: activeProjectPid } = usePidContext();
  const isActive = project.projectPid === activeProjectPid;
  return (
    <Link
      key={project.id}
      href={`?projectPid=${project.projectPid}`}
      className={`${
        isActive
          ? "bg-main outline-2 outline-foreground"
          : "bg-accent hover:bg-muted-foreground hover:text-background"
      } p-2 rounded-md line-clamp-1`}
    >
      {project.title}
    </Link>
  );
};
export default ProjectLink;
