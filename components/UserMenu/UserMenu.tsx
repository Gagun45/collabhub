"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button, buttonVariants } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useGetAvatarUrlQuery } from "@/redux/apis/profile.api";

const UserMenu = () => {
  const { data: session } = useSession();
  const { data: avatarData } = useGetAvatarUrlQuery();

  if (!session?.user)
    return (
      <Link className={buttonVariants({ variant: "primary" })} href="/login">
        Login
      </Link>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={avatarData?.avatarUrl} alt="User avatar" />
          <AvatarFallback>
            {session.user.email?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/dashboard">Dashboard</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/my-teams">My Teams</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Button onClick={() => signOut()}>Logout</Button>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>{session.user?.email}</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default UserMenu;
