import { getTeamByInviteToken } from "@/lib/actions/team.actions";
import { redirect } from "next/navigation";
import TeamInviteClient from "./TeamInviteClient";

interface Props {
  params: Promise<{ token: string }>;
}

const TeamInvitePage = async ({ params }: Props) => {
  const { token } = await params;
  const res = await getTeamByInviteToken(token);
  if (!res) redirect("/");
  const { isMember, team } = res;
  return (
    <main>
      <span>{team.name}</span>
      <span>{team.creator.UserInformation?.username}</span>
      {isMember ? (
        <span>Already a member</span>
      ) : (
        <TeamInviteClient inviteToken={token} />
      )}
    </main>
  );
};
export default TeamInvitePage;
