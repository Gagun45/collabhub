"use client";

import { Button } from "@/components/ui/button";
import {
  useAddMemberToProjectByProjectPidMutation,
  useGetTeamMembersToInviteQuery,
} from "@/redux/apis/projects.api";

interface Props {
  projectPid: string;
}

const InviteToProject = ({ projectPid }: Props) => {
  const [addMember] = useAddMemberToProjectByProjectPidMutation();
  const onAdd = async (userId: number) => {
    try {
      await addMember({ projectPid, userId });
    } catch (e) {
      console.log(e);
    }
  };

  const { data } = useGetTeamMembersToInviteQuery({ projectPid });

  if (!data) return null;
  if (data.members.length === 0) return <span>Everyone already added</span>;

  return (
    <div>
      <span>Add members:</span>
      {data.members.map((tm) => (
        <div key={tm.userId} className="flex items-center gap-2">
          <span>{tm.user.UserInformation?.username}</span>
          <Button onClick={() => onAdd(tm.userId)}>Add to project</Button>
        </div>
      ))}
    </div>
  );
};
export default InviteToProject;
