"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import NewTeamForm from "@/forms/NewTeamForm/NewTeamForm";
import { useDirection } from "@radix-ui/react-direction";
import { useState } from "react";

const NewTeamDialog = () => {
  const direction = useDirection();
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  return (
    <AlertDialog open={dialogIsOpen} onOpenChange={setDialogIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>Create new team</Button>
      </AlertDialogTrigger>
      <AlertDialogContent dir={direction}>
        <AlertDialogHeader>
          <AlertDialogTitle>Creating new team</AlertDialogTitle>
          <AlertDialogDescription>Fill in information about new team</AlertDialogDescription>
        </AlertDialogHeader>
        <NewTeamForm />
        <AlertDialogFooter>
          <AlertDialogCancel>Go Back</AlertDialogCancel>
          <Button onClick={() => setDialogIsOpen(false)}>Create</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default NewTeamDialog;
