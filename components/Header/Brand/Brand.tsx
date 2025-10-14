"use client";
import Link from "next/link";
import { motion } from "framer-motion";

const Brand = () => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide"
    >
      <Link href={"/"} className="text-white">
        Collab Hub
      </Link>
    </motion.div>
  );
};
export default Brand;
