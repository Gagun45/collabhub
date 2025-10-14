"use client";

import {
  Cloud,
  LayoutDashboard,
  MessageSquare,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const FEATURES: Feature[] = [
  {
    icon: MessageSquare,
    title: "Real-time Collaboration",
    desc: "Chat and manage projects together with live updates.",
  },

  {
    icon: LayoutDashboard,
    title: "Kanban Boards",
    desc: "Organize and prioritize with simple drag-and-drop columns.",
  },
  {
    icon: Shield,
    title: "Secure & Reliable",
    desc: "Built with modern authentication and encrypted storage.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    desc: "Your projects are always backed up and accessible from any device.",
  },
];

const Features = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}
      className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
    >
      {FEATURES.map((f) => (
        <motion.div key={f.title} className="max-w-96">
          <Card className="bg-foreground/90 dark:bg-main h-full border-none hover:outline-1 outline-accent-foreground hover:shadow-lg transition">
            <CardContent className="p-6 text-center space-y-3">
              <f.icon className="w-10 h-10 text-main dark:text-secondary-foreground mx-auto" />
              <h3 className="font-semibold text-lg text-main dark:text-secondary-foreground">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.section>
  );
};
export default Features;
