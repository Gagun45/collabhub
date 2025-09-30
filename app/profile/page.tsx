"use client";

import Image from "next/image";
import DefaultAvatar from "@/public/default-avatar.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditProfileForm from "@/forms/EditProfileForm/EditProfileForm";
import { useGetProfilePageDataQuery } from "@/redux/apis/profile.api";
import LoadingIndicator from "@/components/General/LoadingIndicator";

const ProfilePage = () => {
  const { data, isLoading, isError } = useGetProfilePageDataQuery();

  if (isLoading)
    return (
      <main>
        <LoadingIndicator />
      </main>
    );

  if (isError || !data)
    return (
      <main>
        <span className="text-center">Unexpected error occured.</span>
      </main>
    );

  if (!data.data)
    return (
      <main>
        <span className="text-center">{data.message}</span>
      </main>
    );

  const user = data.data;

  return (
    <main className="space-y-8">
      <h1>Profile page</h1>
      <Card>
        <CardContent className="space-y-4 w-72">
          <div className="relative size-36 lg:size-48 mx-auto">
            <Image
              priority
              src={
                user.UserInformation?.avatarUrl ?? user.image ?? DefaultAvatar
              }
              alt="Profile avatar"
              sizes="(max-width: 640px) 144px, 192px"
              fill
            />
          </div>
          <h2 className="text-center">{user.email}</h2>
        </CardContent>
      </Card>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="tracking-wider">Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProfileForm />
        </CardContent>
      </Card>
    </main>
  );
};
export default ProfilePage;
