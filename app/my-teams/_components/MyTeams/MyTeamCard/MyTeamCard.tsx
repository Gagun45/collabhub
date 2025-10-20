import CopyButton from "@/components/General/CopyButton/CopyButton";
import type { MyTeamType } from "@/lib/types";
import Link from "next/link";

interface Props {
  team: MyTeamType;
}

const MyTeamCard = ({ team }: Props) => {
  return (
    <div className="flex flex-col gap-2 border-2 p-4 border-foreground rounded-xl">
      <Link href={`/team/${team.teamPid}`}>
        <h3 className="font-semibold text-xl">{team.name}</h3>

        <span>Members: {team._count.TeamMembers}</span>
      </Link>
      <CopyButton value={team.inviteToken} />
    </div>
  );
};
export default MyTeamCard;
