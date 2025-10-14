"use client";
import { motion } from "framer-motion";

import LoginLeftCard from "./_components/LoginLeftCard";
import LoginRightCard from "./_components/LoginRightCard";

const LoginPage = () => {
  return (
    <main>
      <motion.div
        className="flex gap-2 max-w-6xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <LoginLeftCard />
        <LoginRightCard />
      </motion.div>
    </main>
  );
};
export default LoginPage;
