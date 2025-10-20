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
      process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_BASE_URL_DEV
        : process.env.NEXT_PUBLIC_BASE_URL_PROD;
    await navigator.clipboard.writeText(`${baseUrl}/team/invite/${value}`);
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