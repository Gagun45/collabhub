"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetTeamByTeamPidQuery } from "@/redux/apis/teams.api";

interface Props {
  teamPid: string;
}

const LeftCard = ({ teamPid }: Props) => {
  const { data } = useGetTeamByTeamPidQuery({ teamPid });
  const { team } = data!;
  return (
    <Card className="w-72">
      <CardHeader>
        <CardTitle className="tracking-wider mx-auto">
          Team {team?.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex flex-col">
        <Button>Placeholder</Button>
      </CardContent>
    </Card>
  );
};
export default LeftCard;
