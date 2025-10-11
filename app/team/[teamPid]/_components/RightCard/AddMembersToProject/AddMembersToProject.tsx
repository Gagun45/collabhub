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
import {
  useGetTeamMembersToInviteQuery,
} from "@/redux/apis/projects.api";
import AddMemberCard from "./AddMemberCard/AddMemberCard";

interface Props {
  projectPid: string;
  projectTitle: string;
}

const AddMembersToProject = ({ projectPid, projectTitle }: Props) => {
  const { data } = useGetTeamMembersToInviteQuery({ projectPid });

  if (!data) return null;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Add members</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{projectTitle}</SheetTitle>
          <SheetDescription>Adding members</SheetDescription>
        </SheetHeader>
        <SheetBody className="space-y-2">
          {data.members.length === 0 && <span>Everyone already added</span>}
          {data.members.length > 0 &&
            data.members.map((tm) => (
              <AddMemberCard
                projectPid={projectPid}
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
