import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Prisma } from "@prisma/client";
import ManageMemberCard from "./ManageMemberCard/ManageMemberCard";

interface Props {
  members: Prisma.ProjectMemberGetPayload<{
    include: { user: { include: { UserInformation: true } } };
  }>[];
  projectTitle: string;
  projectPid: string;
}

const ManageProjectMembers = ({ members, projectTitle, projectPid }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Manage members</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{projectTitle}</SheetTitle>
          <SheetDescription>Managing members</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-2">
          {members.map((tm) => (
            <ManageMemberCard
              key={tm.userId}
              member={tm}
              projectPid={projectPid}
            />
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
export default ManageProjectMembers;
