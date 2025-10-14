import type { MyTeamType } from "@/lib/types";
import Link from "next/link";

interface Props {
  team: MyTeamType;
}

const MyTeamCard = ({ team }: Props) => {
  return (
    <Link
      href={`/team/${team.teamPid}`}
      className="flex flex-col border-2 p-4 border-foreground rounded-xl"
    >
      <h3 className="font-semibold text-xl">{team.name}</h3>

      <span>Members: {team._count.TeamMembers}</span>
    </Link>
  );
};
export default MyTeamCard;
