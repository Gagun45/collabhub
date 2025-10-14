"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import NewTeamForm from "@/forms/NewTeamForm/NewTeamForm";
import type { newTeamSchemaType } from "@/lib/types";
import { useCreateNewTeamMutation } from "@/redux/apis/teams.api";
import { useDirection } from "@radix-ui/react-direction";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const NewTeamDialog = () => {
  const direction = useDirection();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [createTeam, { isLoading }] = useCreateNewTeamMutation();
  const onCreate = async (values: newTeamSchemaType) => {
    try {
      await createTeam({ values }).unwrap();
      toast.success("Team created");
    } catch (error) {
      const err = error as string;
      toast.error(err);
    } finally {
      setDialogIsOpen(false);
    }
  };
  return (
    <AlertDialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          {" "}
          <Plus className="size-4" />
          Create team
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir={direction}>
        <AlertDialogHeader>
          <AlertDialogTitle>Creating new team</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in information about new team
          </AlertDialogDescription>
        </AlertDialogHeader>
        <NewTeamForm isLoading={isLoading} onCreate={onCreate} />
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default NewTeamDialog;
