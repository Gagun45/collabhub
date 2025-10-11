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
        isActive ? "bg-slate-500 outline-2" : "bg-slate-100 hover:bg-slate-300"
      } p-2 rounded-md line-clamp-1`}
    >
      {project.title}
    </Link>
  );
};
export default ProjectLink;
