"use client";
import { motion } from "framer-motion";

const CTA = () => {
  return (
    <motion.h2
      className="text-center text-3xl font-semibold py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
    >
      Start collaborating with your team today
    </motion.h2>
  );
};
export default CTA;
