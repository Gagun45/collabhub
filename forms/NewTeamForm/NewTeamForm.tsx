"use client";

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
import { useCreateNewTeamMutation } from "@/redux/apis/teams.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const NewTeamForm = () => {
  const [createTeam] = useCreateNewTeamMutation();
  const form = useForm<newTeamSchemaType>({
    resolver: zodResolver(newTeamSchema),
    defaultValues: {
      name: "",
    },
  });
  const onSubmit = async (values: newTeamSchemaType) => {
    try {
      await createTeam({ values }).unwrap();
      toast.success("Team created");
    } catch (error) {
      const err = error as string;
      toast.error(err);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">asdasd</Button>
      </form>
    </Form>
  );
};
export default NewTeamForm;
