import Image from "next/image";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";

const LoginRightCard = () => {
  const handleLogin = () => {
    signIn("google");
  };
  return (
    <div className="bg-transparent px-8 py-16 rounded-2xl shadow-2xl md:shadow-none max-w-sm w-full text-center space-y-12">
      <Image
        src="/file.svg"
        alt="CollabHub Logo"
        width={128}
        height={128}
        className="mx-auto"
      />
      <h2 className="text-2xl font-semibold">Sign in to your account</h2>

      <Button
        onClick={handleLogin}
        size="lg"
        className="w-full flex items-center justify-center gap-2"
      >
        <LogIn className="w-5 h-5" />
        Continue with Google
      </Button>
    </div>
  );
};
export default LoginRightCard;
