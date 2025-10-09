import type { Team } from "@prisma/client";
import Link from "next/link";

interface Props {
  team: Team;
}

const MyTeamCard = ({ team }: Props) => {
  return (
    <div className="w-full border-2 border-black space-x-4">
      <span>{team.name}</span>
      <Link href={`/team/${team.teamPid}`}>Goto</Link>
      <span>{team.inviteToken}</span>
    </div>
  );
};
export default MyTeamCard;
