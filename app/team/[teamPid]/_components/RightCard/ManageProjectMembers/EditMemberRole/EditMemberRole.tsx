import { useEditProjectMemberRoleMutation } from "@/redux/apis/projects.api";
import type { $Enums } from "@prisma/client";
import { useEffect, useState } from "react";
import { usePidContext } from "../../../ProjectPidContext";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
    <DropdownMenuItem disabled={loading} onClick={onEdit}>
      {memberRole === "ADMIN" ? "Remove" : "Grant"} admin rights
    </DropdownMenuItem>
  );
};
export default EditMemberRole;
