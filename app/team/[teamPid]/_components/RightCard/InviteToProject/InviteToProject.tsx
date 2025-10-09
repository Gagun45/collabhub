"use client";

import { Button } from "@/components/ui/button";
import { addMemberToProjectByProjectPid } from "@/lib/actions/project.actions";
import { useGetTeamMembersToInviteQuery } from "@/redux/apis/projects.api";

interface Props {
  projectPid: string;
}

const InviteToProject = ({ projectPid }: Props) => {
  const onAdd = async (userId: number) => {
    await addMemberToProjectByProjectPid(projectPid, userId);
  };

  const { data, isFetching } = useGetTeamMembersToInviteQuery({ projectPid });
  if (isFetching) return null;
  return (
    <div>
      InviteToProject
      {data?.members.map((tm) => (
        <div key={tm.userId} className="flex items-center gap-2">
          <span>{tm.user.UserInformation?.username}</span>
          <Button onClick={() => onAdd(tm.userId)}>Add to project</Button>
        </div>
      ))}
    </div>
  );
};
export default InviteToProject;
