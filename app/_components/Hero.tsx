"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="max-w-6xl mx-auto py-8 text-center space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl md:text-6xl font-bold text-slate-950"
      >
        Collaborate. Manage. Ship faster.
      </motion.h1>
      <motion.div
        className="space-y-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-lg text-slate-800 max-w-2xl mx-auto">
          A modern workspace to manage projects, tasks, and teams — all in one
          place.
        </p>

        <Button
          size={"lg"}
          asChild
          className="bg-slate-950 text-xl md:text-2xl p-6 md:p-8 rounded-4xl hover:bg-slate-900"
        >
          <Link href={"/my-teams"}>Get Started</Link>
        </Button>
      </motion.div>
    </section>
  );
};
export default Hero;
