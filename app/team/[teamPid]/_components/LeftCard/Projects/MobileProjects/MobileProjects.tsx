import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Project } from "@prisma/client";
import { useRouter } from "next/navigation";

interface Props {
  projects: Project[];
}

const MobileProjects = ({ projects }: Props) => {
  const router = useRouter();
  const onChange = (projectPid: string) => {
    router.push(`?projectPid=${projectPid}`);
  };
  return (
    <Select onValueChange={(value) => onChange(value)}>
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
