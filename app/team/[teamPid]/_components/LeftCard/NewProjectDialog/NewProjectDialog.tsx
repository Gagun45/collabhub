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
import NewProjectForm from "@/forms/NewProjectForm/NewProjectForm";
import type { newProjectSchemaType } from "@/lib/types";
import { useCreateNewProjectMutation } from "@/redux/apis/projects.api";
import { useDirection } from "@radix-ui/react-direction";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  teamPid: string;
}

const NewProjectDialog = ({ teamPid }: Props) => {
  const direction = useDirection();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [createProject, { isLoading }] = useCreateNewProjectMutation();
  const onCreate = async (values: newProjectSchemaType) => {
    try {
      await createProject({ teamPid, values }).unwrap();
      toast.success("Project created");
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
        <Button>Create new project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir={direction}>
        <AlertDialogHeader>
          <AlertDialogTitle>Creating new project</AlertDialogTitle>
          <AlertDialogDescription>
            Fill in information about new project
          </AlertDialogDescription>
        </AlertDialogHeader>
        <NewProjectForm isLoading={isLoading} onCreate={onCreate} />
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default NewProjectDialog;
