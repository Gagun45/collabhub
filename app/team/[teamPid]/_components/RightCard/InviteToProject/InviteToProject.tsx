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
  useAddMemberToProjectByProjectPidMutation,
  useGetTeamMembersToInviteQuery,
} from "@/redux/apis/projects.api";
import { PlusCircleIcon } from "lucide-react";

interface Props {
  projectPid: string;
  projectTitle: string;
}

const InviteToProject = ({ projectPid, projectTitle }: Props) => {
  const [addMember] = useAddMemberToProjectByProjectPidMutation();
  const onAdd = async (userId: number) => {
    try {
      await addMember({ projectPid, userId });
    } catch (e) {
      console.log(e);
    }
  };

  const { data } = useGetTeamMembersToInviteQuery({ projectPid });

  if (!data) return null;
  if (data.members.length === 0) return <span>Everyone already added</span>;

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
          {data.members.map((tm) => (
            <div key={tm.userId} className="flex items-center gap-2 border-b-2">
              <span>{tm.user.UserInformation?.username}</span>
              <Button
                variant={"inverse"}
                onClick={() => onAdd(tm.userId)}
                className="shrink-0 ml-auto"
              >
                <PlusCircleIcon
                  className="size-7
                "
                  color={"black"}
                />
              </Button>
            </div>
          ))}
        </SheetBody>
      </SheetContent>
    </Sheet>
  );
};
export default InviteToProject;
