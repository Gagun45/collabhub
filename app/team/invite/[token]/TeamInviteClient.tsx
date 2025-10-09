"use client";

import { Button } from "@/components/ui/button";
import { joinTeamByInviteToken } from "@/lib/actions/team.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  inviteToken: string;
}

const TeamInviteClient = ({ inviteToken }: Props) => {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  const onJoin = async () => {
    setLoading(true);
    try {
      const teamPid = await joinTeamByInviteToken(inviteToken);
      router.push(`/team/${teamPid}`);
    } catch {
      toast.error("Something went wrong");
      setLoading(false);
    }
  };
  return (
    <Button onClick={onJoin} disabled={isLoading}>
      {isLoading ? "Joining..." : "Join"}
    </Button>
  );
};
export default TeamInviteClient;
