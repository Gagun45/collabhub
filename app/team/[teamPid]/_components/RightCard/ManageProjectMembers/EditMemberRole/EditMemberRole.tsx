import { Button } from "@/components/ui/button";
import { useEditProjectMemberRoleMutation } from "@/redux/apis/projects.api";
import type { $Enums } from "@prisma/client";
import { useEffect, useState } from "react";
import { usePidContext } from "../../../ProjectPidContext";

interface Props {
  memberRole: $Enums.ProjectRole;
  userId: number;
}

const EditMemberRole = ({ memberRole, userId }: Props) => {
  const newMemberRole: $Enums.ProjectRole =
    memberRole === "ADMIN" ? "USER" : "ADMIN";
  const [editRole] = useEditProjectMemberRoleMutation();
  const { projectPid } = usePidContext();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(false);
  }, [memberRole]);
  const onEdit = async () => {
    setLoading(true);
    try {
      await editRole({ newMemberRole, userId, projectPid }).unwrap();
    } catch {}
  };
  return (
    <Button disabled={loading} onClick={onEdit} className="ml-auto">
      Make {memberRole === "ADMIN" ? "user" : "admin"}
    </Button>
  );
};
export default EditMemberRole;
