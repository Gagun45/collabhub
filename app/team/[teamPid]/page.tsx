import { redirect } from "next/navigation";
import TeamPageClient from "./_components/TeamPageClient";
import { verifyTeamAccessByTeamPidOrThrow } from "@/lib/actions/helper";

interface Props {
  params: Promise<{ teamPid: string }>;
}

const TeamPage = async ({ params }: Props) => {
  const { teamPid } = await params;
  try {
    await verifyTeamAccessByTeamPidOrThrow(teamPid);
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
