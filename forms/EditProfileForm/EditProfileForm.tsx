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
import { useEffect } from "react";
import { toast } from "sonner";

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
  useEffect(() => {
    form.reset({
      bio: bio ?? "",
      location: location ?? "",
      name: name ?? "",
      username: username ?? "",
      birthDate: birthDate ?? null,
    });
  }, [bio, location, name, username, birthDate, form]);

  const onSubmit = async (values: editProfileSchemaType) => {
    try {
      await updateProfile({ values }).unwrap();
      toast.success("Profile updated");
    } catch (error) {
      const err = error as string;
      toast.error(err);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <fieldset disabled={isSubmitting} className="space-y-4">
          <UsernameInput />
          <NameInput />
          <LocationInput />
          <BioInput />
          <BirthDateInput />
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <Button
              disabled={!form.formState.isDirty}
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
            <Button disabled={isSubmitting || !form.formState.isDirty}>
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
};
export default EditProfileForm;
