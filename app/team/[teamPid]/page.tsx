import { getAuthUser } from "@/lib/actions/helper";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TeamPageClient from "./_components/TeamPageClient";

interface Props {
  params: Promise<{ teamPid: string }>;
}

const TeamPage = async ({ params }: Props) => {
  const user = await getAuthUser();
  if (!user) redirect("/login");
  const { teamPid } = await params;
  const team = await prisma.team.findUnique({ where: { teamPid } });
  if (!team) return <main>Team not found</main>;
  const isAllowed = await prisma.teamMember.findUnique({
    where: { teamId_userId: { teamId: team.id, userId: user.id } },
  });
  if (!isAllowed) return <main>Access denied</main>;
  return (
    <main>
      <TeamPageClient teamPid={teamPid} />
    </main>
  );
};
export default TeamPage;
