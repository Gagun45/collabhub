"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditProfileForm from "@/forms/EditProfileForm/EditProfileForm";
import { useGetProfilePageDataQuery } from "@/redux/apis/profile.api";
import LoadingIndicator from "@/components/General/LoadingIndicator";
import AvatarCard from "./_components/AvatarCard/AvatarCard";

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
        <AvatarCard user={user} />
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
