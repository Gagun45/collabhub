"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetTeamMembersToInviteQuery } from "@/redux/apis/projects.api";
import AddMemberCard from "./AddMemberCard/AddMemberCard";
import { usePidContext } from "../../ProjectPidContext";

interface Props {
  projectTitle: string;
}

const AddMembersToProject = ({ projectTitle }: Props) => {
  const { projectPid } = usePidContext();
  const { data } = useGetTeamMembersToInviteQuery({ projectPid });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add members</Button>
      </SheetTrigger>
      <SheetContent className="!max-w-4xl">
        <SheetHeader>
          <SheetTitle>{projectTitle}</SheetTitle>
          <SheetDescription>Adding members</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-4">
          {data?.members.length === 0 && <span>Everyone already added</span>}
          {data?.members &&
            data?.members.length > 0 &&
            data?.members.map((tm) => (
              <AddMemberCard
                userId={tm.userId}
                username={tm.user.UserInformation?.username ?? ""}
                key={tm.userId}
              />
            ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
export default AddMembersToProject;
