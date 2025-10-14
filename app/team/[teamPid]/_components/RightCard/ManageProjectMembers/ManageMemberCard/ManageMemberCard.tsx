import { Button } from "@/components/ui/button";
import type { $Enums, Prisma } from "@prisma/client";
import { isAtLeastProjectAdmin, isBiggerProjectRole } from "@/lib/utils";
import EditMemberRole from "../EditMemberRole/EditMemberRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";
import RemoveMemberFromProject from "../RemoveMemberFromProject/RemoveMemberFromProject";

interface Props {
  member: Prisma.ProjectMemberGetPayload<{
    include: { user: { include: { UserInformation: true } } };
  }>;
  currentUserRole: $Enums.ProjectRole;
}

const ManageMemberCard = ({ member, currentUserRole }: Props) => {
  const { role: memberRole } = member;
  const userId = member.userId;
  const isBiggerRole = isBiggerProjectRole(currentUserRole, memberRole);
  const isAtLeastAdmin = isAtLeastProjectAdmin(currentUserRole);

  const username = member.user.UserInformation?.username ?? "";

  return (
    <div className="flex gap-2 items-center">
      <span className="break-all text-sm">{username}</span>
      {isAtLeastAdmin && isBiggerRole && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="!p-0" variant={"ghost"}>
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col items-start">
            <EditMemberRole memberRole={memberRole} userId={member.userId} />
            <RemoveMemberFromProject userId={userId} />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
export default ManageMemberCard;
