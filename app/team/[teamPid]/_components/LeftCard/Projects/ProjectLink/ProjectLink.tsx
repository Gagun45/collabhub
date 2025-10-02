import type { Project } from "@prisma/client";
import Link from "next/link";

interface Props {
  project: Project;
  activeProjectId: string | null;
}

const ProjectLink = ({ project, activeProjectId }: Props) => {
  const projectIdAsNumber = parseInt(activeProjectId ?? "a");
  return (
    <Link
      key={project.id}
      href={`?projectId=${project.id}`}
      className={`${
        project.id === projectIdAsNumber
          ? "bg-slate-500 outline-2"
          : "bg-slate-100 hover:bg-slate-300"
      } p-2 rounded-md line-clamp-1`}
    >
      {project.title}
    </Link>
  );
};
export default ProjectLink;
