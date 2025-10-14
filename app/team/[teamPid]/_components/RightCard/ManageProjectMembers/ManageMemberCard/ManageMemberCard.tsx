import { Button } from "@/components/ui/button";
import { PROJECT_ROLE_HIERARCHY, UNEXPECTED_ERROR } from "@/lib/constants";
import { useDeleteMemberFromProjectMutation } from "@/redux/apis/projects.api";
import type { $Enums, Prisma } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { usePidContext } from "../../../ProjectPidContext";
import { isBiggerProjectRole } from "@/lib/utils";
import EditMemberRole from "../EditMemberRole/EditMemberRole";

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
    <div className="flex items-center gap-2">
      <span className="break-all text-sm">{username}</span>
      {isSuperAdmin && memberRole !== "SUPERADMIN" && (
        <EditMemberRole memberRole={memberRole} userId={member.userId} />
      )}
      {isBiggerProjectRole(currentUserRole, memberRole) && (
        <Button
          variant={"destructive"}
          className="ml-auto"
          disabled={loading}
          onClick={() => {
            setLoading(true);
            onDelete();
          }}
        >
          {loading ? "Loading..." : "Remove"}
        </Button>
      )}
    </div>
  );
};
export default ManageMemberCard;
