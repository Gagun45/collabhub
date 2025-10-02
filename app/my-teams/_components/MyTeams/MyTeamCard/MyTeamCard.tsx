import type { Team } from "@prisma/client";

interface Props {
  team: Team;
}

const MyTeamCard = ({ team }: Props) => {
  return <div className="w-full border-2 border-black">{team.name}</div>;
};
export default MyTeamCard;
