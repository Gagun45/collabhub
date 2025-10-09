"use client";

import { Button } from "@/components/ui/button";
import {
  addMemberToProjectByProjectPid,
  getTeamMembersByProjectPid,
} from "@/lib/actions/project.actions";
import type { ProjectMembersToInvite } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

interface Props {
  projectPid: string;
}

const InviteToProject = ({ projectPid }: Props) => {
  const onAdd = async (userId: number) => {
    await addMemberToProjectByProjectPid(projectPid, userId);
  };
  const [toInviteMembers, setToInviteMembers] = useState<
    ProjectMembersToInvite[]
  >([]);
  const fetchMembers = useCallback(async () => {
    const members = await getTeamMembersByProjectPid(projectPid);
    setToInviteMembers(members!);
  }, [projectPid]);
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);
  return (
    <div>
      InviteToProject
      {toInviteMembers.map((tm) => (
        <div key={tm.userId} className="flex items-center gap-2">
          <span>{tm.user.UserInformation?.username}</span>
          <Button onClick={() => onAdd(tm.userId)}>Add to project</Button>
        </div>
      ))}
    </div>
  );
};
export default InviteToProject;
