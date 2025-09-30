"use client";

import type { editProfileSchemaType } from "@/lib/types";
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
import {
  useGetProfilePageDataQuery,
  useUpdateProfilePageDataMutation,
} from "@/redux/apis/profile.api";

const EditProfileForm = () => {
  const [updateProfile, { isLoading: isSubmitting }] =
    useUpdateProfilePageDataMutation();
  const { data: profileData } = useGetProfilePageDataQuery();
  const { bio, birthDate, location, name, username } =
    profileData!.data!.UserInformation!;

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
    updateProfile({ values });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <fieldset disabled={isSubmitting}>
          <UsernameInput />
          <NameInput />
          <LocationInput />
          <BioInput />
          <BirthDateInput />
          <Button
            type="button"
            onClick={() =>
              form.reset({
                bio: bio ?? "",
                location: location ?? "",
                name: name ?? "",
                username: username ?? "",
                birthDate: birthDate ?? null,
              })
            }
          >
            Reset
          </Button>
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
};
export default EditProfileForm;
