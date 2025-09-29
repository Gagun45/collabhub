"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  return (
    <main>
      Login page
      <Button onClick={() => signIn("google")}>Login via google</Button>
    </main>
  );
};
export default LoginPage;
