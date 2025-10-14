"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const CTA = () => {
  return (
    <motion.section
      className="text-center py-24 space-y-12"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
    >
      <motion.h2 className="text-3xl font-semibold">
        Start collaborating with your team today.
      </motion.h2>
      <Button asChild className="text-xl p-6 rounded-xl">
        <Link href="/login">Create Your Free Account</Link>
      </Button>
    </motion.section>
  );
};
export default CTA;
