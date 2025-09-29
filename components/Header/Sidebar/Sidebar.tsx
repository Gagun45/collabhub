"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import Link from "next/link";
import { useState } from "react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant={"outline"} className="block xl:hidden">
          Open sheet
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0">
        <SheetHeader className="h-32 bg-blue-400 flex items-center justify-center">
          <Link href={"/"}>
            <SheetTitle className="text-4xl tracking-widest">
              CollabHub
            </SheetTitle>
          </Link>
        </SheetHeader>

        <SheetBody className="grow p-0">
          <ScrollArea className="h-[calc(100vh-256px)]">
            <Link href={"/"}>Home</Link>
          </ScrollArea>
        </SheetBody>

        <SheetFooter className="h-32 bg-blue-400 flex items-center !justify-center">
          <UserMenu />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
export default Sidebar;
