"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import UserMenu from "@/components/UserMenu/UserMenu";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import MyTeamsSidebar from "./SidebarMyTeams/SibedarMyTeams";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className="block xl:hidden">
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0 gap-0 bg-main">
        <SheetHeader className="h-32 bg-main flex items-center justify-center">
          <Link href={"/"}>
            <SheetTitle className="text-4xl tracking-widest">
              CollabHub
            </SheetTitle>
          </Link>
        </SheetHeader>

        <SheetBody className="p-0">
          <MyTeamsSidebar setIsOpen={setIsOpen} />
        </SheetBody>

        <SheetFooter className="h-32 bg-main flex items-center !justify-center">
          <UserMenu />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default Sidebar;
