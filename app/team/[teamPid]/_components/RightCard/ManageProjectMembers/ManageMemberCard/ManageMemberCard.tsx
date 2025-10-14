import { Button } from "@/components/ui/button";
import { PROJECT_ROLE_HIERARCHY, UNEXPECTED_ERROR } from "@/lib/constants";
import { useDeleteMemberFromProjectMutation } from "@/redux/apis/projects.api";
import type { $Enums, Prisma } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { usePidContext } from "../../../ProjectPidContext";
import { isBiggerProjectRole } from "@/lib/utils";
import EditMemberRole from "../EditMemberRole/EditMemberRole";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon } from "lucide-react";

interface Props {
  member: Prisma.ProjectMemberGetPayload<{
    include: { user: { include: { UserInformation: true } } };
  }>;
  currentUserRole: $Enums.ProjectRole;
}

const ManageMemberCard = ({ member, currentUserRole }: Props) => {
  const { role: memberRole } = member;
  const { projectPid } = usePidContext();
  const userId = member.userId;
  const isSuperAdmin =
    PROJECT_ROLE_HIERARCHY[currentUserRole] ===
    PROJECT_ROLE_HIERARCHY.SUPERADMIN;
  const [loading, setLoading] = useState(false);
  const [removeMember] = useDeleteMemberFromProjectMutation();
  const username = member.user.UserInformation?.username ?? "";
  const onDelete = async () => {
    try {
      await removeMember({ projectPid, userId }).unwrap();
    } catch {
      toast.error(UNEXPECTED_ERROR);
      setLoading(false);
    }
  };
  return (
    <div className="flex gap-2 items-center">
      <span className="break-all text-sm">{username}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="!p-0" variant={"ghost"}>
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {isSuperAdmin && memberRole !== "SUPERADMIN" && (
            <EditMemberRole memberRole={memberRole} userId={member.userId} />
          )}

          {isBiggerProjectRole(currentUserRole, memberRole) && (
            <DropdownMenuItem
              variant={"destructive"}
              disabled={loading}
              onClick={() => {
                setLoading(true);
                onDelete();
              }}
            >
              {loading ? "Loading..." : "Remove"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ManageMemberCard;
