import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@prisma/client";
import { useRouter } from "next/navigation";
import { usePidContext } from "../../../ProjectPidContext";
import { useEffect, useState } from "react";

interface Props {
  projects: Project[];
}

const MobileProjects = ({ projects }: Props) => {
  const { projectPid } = usePidContext();
  const [localPid, setLocalPid] = useState(projectPid);
  const router = useRouter();
  const validPids = projects.map((pr) => pr.projectPid);
  const fallbackPid = validPids.includes(localPid ?? "") ? localPid : "";
  useEffect(() => {
    router.replace(`?projectPid=${localPid}`);
  }, [localPid, router]);
  return (
    <Select onValueChange={(value) => setLocalPid(value)} value={fallbackPid}>
      <SelectTrigger className="w-full xl:hidden">
        <SelectValue placeholder="Choose a project" />
      </SelectTrigger>
      <SelectContent>
        {projects.map((pr) => (
          <SelectItem key={pr.projectPid} value={pr.projectPid}>
            {pr.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
export default MobileProjects;
