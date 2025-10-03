"use client";

import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { newTeamSchemaType } from "@/lib/types";
import { newTeamSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  onCreate: (values: newTeamSchemaType) => Promise<void>;
  isLoading: boolean;
}

const NewTeamForm = ({ onCreate, isLoading }: Props) => {
  const form = useForm<newTeamSchemaType>({
    resolver: zodResolver(newTeamSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: newTeamSchemaType) => {
    await onCreate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team name</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus/>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <Button type="submit">
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </AlertDialogFooter>
        </fieldset>
      </form>
    </Form>
  );
};
export default NewTeamForm;
