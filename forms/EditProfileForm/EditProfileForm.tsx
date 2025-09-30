"use client";

import type { editProfileSchemaType } from "@/lib/types";
import type { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema } from "@/lib/zod-schemas";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import UsernameInput from "./UsernameInput/UsernameInput";
import LocationInput from "./LocationInput/LocationInput";
import NameInput from "./NameInput/NameInput";
import BioInput from "./BioInput/BioInput";
import BirthDateInput from "./BirthDateInput/BirthDateInput";

interface Props {
  userInformation: Prisma.UserInformationGetPayload<{
    omit: { userId: true; userPid: true; avatarUrl: true };
  }>;
}

const EditProfileForm = ({ userInformation }: Props) => {
  const { bio, birthDate, location, name, username } = userInformation;

  const form = useForm<editProfileSchemaType>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      bio: bio ?? "",
      location: location ?? "",
      name: name ?? "",
      username: username ?? "",
      birthDate: birthDate ?? null,
    },
  });

  const onSubmit = (values: editProfileSchemaType) => {
    console.log(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <UsernameInput />
        <NameInput />
        <LocationInput />
        <BioInput />
        <BirthDateInput />
        <Button type="button" onClick={() => form.reset()}>
          Reset
        </Button>
        <Button>Submit</Button>
      </form>
    </Form>
  );
};
export default EditProfileForm;
