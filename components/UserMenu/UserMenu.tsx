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
import useSWR from "swr";
import { getAvatarUrl } from "@/lib/actions/user.actions";

const UserMenu = () => {
  const { data: session, status } = useSession();
  const { data: urlData } = useSWR("profile", async () => getAvatarUrl());

  if (status === "loading") return null;

  if (!session?.user)
    return (
      <Link className={buttonVariants({ variant: "outline" })} href="/login">
        Login
      </Link>
    );
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={urlData?.avatarUrl} alt="@reui" />
          <AvatarFallback>CH</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/profile">Profile</Link>
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
