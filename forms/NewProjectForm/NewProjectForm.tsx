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
import type { newProjectSchemaType } from "@/lib/types";
import { newProjectSchema } from "@/lib/zod-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface Props {
  onCreate: (values: newProjectSchemaType) => Promise<void>;
  isLoading: boolean;
}

const NewProjectForm = ({ onCreate, isLoading }: Props) => {
  const form = useForm<newProjectSchemaType>({
    resolver: zodResolver(newProjectSchema),
    defaultValues: {
      title: "",
    },
  });
  const onSubmit = async (values: newProjectSchemaType) => {
    await onCreate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input {...field} autoFocus />
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
export default NewProjectForm;
