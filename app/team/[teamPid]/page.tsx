import { verifyTeamAccessByTeamPid } from "@/lib/actions/helper";
import { redirect } from "next/navigation";
import TeamPageClient from "./_components/TeamPageClient";

interface Props {
  params: Promise<{ teamPid: string }>;
}

const TeamPage = async ({ params }: Props) => {
  const { teamPid } = await params;
  try {
    await verifyTeamAccessByTeamPid(teamPid);
  } catch {
    redirect("/");
  }
  return (
    <main>
      <TeamPageClient teamPid={teamPid} />
    </main>
  );
};
export default TeamPage;
