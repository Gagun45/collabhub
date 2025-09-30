import { getProfilePageUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import DefaultAvatar from "@/public/default-avatar.png";
import H1 from "@/components/General/H1";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditProfileForm from "@/forms/EditProfileForm/EditProfileForm";

const ProfilePage = async () => {
  const user = await getProfilePageUser();
  if (!user) return <main>User not found</main>;

  return (
    <main className="space-y-8">
      <H1>Profile page</H1>
      <Card>
        <CardContent className="space-y-4 w-72">
          <div className="relative size-36 lg:size-48 mx-auto">
            <Image
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
          <EditProfileForm userInformation={user.UserInformation!} />
        </CardContent>
      </Card>
    </main>
  );
};
export default ProfilePage;
