"use client";

import Image from "next/image";
import DefaultAvatar from "@/public/default-avatar.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditProfileForm from "@/forms/EditProfileForm/EditProfileForm";
import { useGetProfilePageDataQuery } from "@/redux/apis/profile.api";
import LoadingIndicator from "@/components/General/LoadingIndicator";

const ProfilePage = () => {
  const {
    data: profileData,
    isLoading,
    isError,
    error,
  } = useGetProfilePageDataQuery();

  if (isLoading)
    return (
      <main>
        <LoadingIndicator />
      </main>
    );

  if (isError)
    return (
      <main>
        <span className="text-center">{error as string}</span>
      </main>
    );

  if (!profileData?.data)
    return (
      <main>
        <span>Something went wrong.</span>
      </main>
    );
  const user = profileData.data;

  return (
    <main className="space-y-8">
      <h1>Profile page</h1>
      <div className="flex flex-col items-center w-full gap-12 lg:flex-row lg:justify-center lg:items-start">
        <Card className="w-full max-w-2xl lg:w-72 shrink-0">
          <CardContent className="space-y-4">
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
            <h2 className="text-center break-words">{user.email}</h2>
          </CardContent>
        </Card>
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="tracking-wider">
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <EditProfileForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};
export default ProfilePage;
