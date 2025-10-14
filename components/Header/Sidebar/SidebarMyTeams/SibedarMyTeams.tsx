import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetMyTeamsQuery } from "@/redux/apis/teams.api";
import Link from "next/link";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

const MyTeamsSidebar = ({ setIsOpen }: Props) => {
  const { data } = useGetMyTeamsQuery();
  return (
    <ScrollArea className="h-[calc(100vh-256px)]">
      <div className="flex flex-col py-4 px-2 gap-4 border-b-2">
        <h2 className="text-center text-3xl font-bold">My teams</h2>
        {data?.teams &&
          data.teams.map((team) => (
            <Link
              onClick={() => setIsOpen(false)}
              className="text-xl font-semibold w-full px-4 py-2 hover:bg-slate-900 hover:text-white rounded-xl"
              key={team.teamPid}
              href={`/team/${team.teamPid}`}
            >
              {team.name}
            </Link>
          ))}
      </div>
    </ScrollArea>
  );
};
export default MyTeamsSidebar;
