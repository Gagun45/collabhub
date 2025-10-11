import { Button } from "@/components/ui/button";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import { useDeleteMemberFromProjectMutation } from "@/redux/apis/projects.api";
import type { $Enums, Prisma } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";
import { usePidContext } from "../../../ProjectPidContext";
import { isBiggerProjectRole } from "@/lib/utils";

interface Props {
  member: Prisma.ProjectMemberGetPayload<{
    include: { user: { include: { UserInformation: true } } };
  }>;
  currentUserRole: $Enums.ProjectRole;
}

const ManageMemberCard = ({ member, currentUserRole }: Props) => {
  const { projectPid } = usePidContext();
  const userId = member.userId;
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
    <div className="flex items-center gap-2 border-b-2">
      <span className="break-all">{username}</span>
      {isBiggerProjectRole(currentUserRole, member.role) && (
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
