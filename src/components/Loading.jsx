import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity }}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </motion.div>
    </div>
  );
};

export default Loading;
