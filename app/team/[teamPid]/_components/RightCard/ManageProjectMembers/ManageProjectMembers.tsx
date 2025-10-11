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
import type { $Enums, Prisma } from "@prisma/client";
import ManageMemberCard from "./ManageMemberCard/ManageMemberCard";

interface Props {
  members: Prisma.ProjectMemberGetPayload<{
    include: { user: { include: { UserInformation: true } } };
  }>[];
  projectTitle: string;
  currentUserRole: $Enums.ProjectRole;
}

const ManageProjectMembers = ({
  members,
  projectTitle,
  currentUserRole,
}: Props) => {
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
              currentUserRole={currentUserRole}
            />
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
export default ManageProjectMembers;
