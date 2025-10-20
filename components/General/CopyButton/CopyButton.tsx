"use client";

import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  value: string;
  className?: string;
}

const CopyButton = ({ value, className }: Props) => {
  const [allowedToCopy, setAllowedToCopy] = useState(true);
  const handleCopy = async () => {
    if (!allowedToCopy) return;
    const baseUrl =
      typeof window !== "undefined"
        ? process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : window.location.origin
        : "https://collabhub-blush.vercel.app";
    const inviteUrl = `${baseUrl}/team/invite/${value}`;

    await navigator.clipboard.writeText(inviteUrl);
    setAllowedToCopy(false);
    const copyDelayTimeout = setTimeout(() => {
      setAllowedToCopy(true);
    }, 1000);
    toast.info("Copied to clipboard!");
    return () => clearTimeout(copyDelayTimeout);
  };
  return (
    <Button onClick={handleCopy} className={className}>
      Copy invite link
      <CopyIcon />
    </Button>
  );
};
export default CopyButton;
