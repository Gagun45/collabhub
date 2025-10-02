import type { Team } from "@prisma/client";
import Link from "next/link";

interface Props {
  team: Team;
}

const MyTeamCard = ({ team }: Props) => {
  return (
    <div className="w-full border-2 border-black">
      {team.name}
      <Link href={`/team/${team.teamPid}`}>Goto</Link>
    </div>
  );
};
export default MyTeamCard;
