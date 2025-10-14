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
  const superadmins = members.filter((m) => m.role === "SUPERADMIN");
  const admins = members.filter((m) => m.role === "ADMIN");
  const users = members.filter((m) => m.role === "USER");
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>View all</Button>
      </SheetTrigger>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>{projectTitle}</SheetTitle>
          <SheetDescription>All project users</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-2">
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/30 p-3">
            <span className="font-medium text-sm text-muted-foreground">
              Superadmins - {superadmins.length}
            </span>
            {superadmins.map((tm) => (
              <ManageMemberCard
                key={tm.userId}
                member={tm}
                currentUserRole={currentUserRole}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/30 p-3">
            <span className="font-medium text-sm text-muted-foreground">
              Admins - {admins.length}
            </span>
            {admins.map((tm) => (
              <ManageMemberCard
                key={tm.userId}
                member={tm}
                currentUserRole={currentUserRole}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-border/50 bg-muted/30 p-3">
            <span className="font-medium text-sm text-muted-foreground">
              Users - {users.length}
            </span>
            {users.map((tm) => (
              <ManageMemberCard
                key={tm.userId}
                member={tm}
                currentUserRole={currentUserRole}
              />
            ))}
          </div>
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
export default ManageProjectMembers;
