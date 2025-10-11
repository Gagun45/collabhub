import { Button } from "@/components/ui/button";
import { UNEXPECTED_ERROR } from "@/lib/constants";
import { useDeleteMemberFromProjectMutation } from "@/redux/apis/projects.api";
import type { Prisma } from "@prisma/client";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  member: Prisma.ProjectMemberGetPayload<{
    include: { user: { include: { UserInformation: true } } };
  }>;
  projectPid: string;
}

const ManageMemberCard = ({ member, projectPid }: Props) => {
  const userId = member.userId;
  const isAdmin = member.role === "ADMIN";
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
      {!isAdmin && (
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
