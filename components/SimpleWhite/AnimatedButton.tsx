import { motion } from "framer-motion";
import {ReactNode} from "react";

const buttonVariants = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

const textVariants = {
  rest: { y: 0 },
  hover: { y: -30 },
};

const newTextVariants = {
  rest: { y: 20, opacity: 0 },
  hover: { y: 0, opacity: 1 },
};



interface inputProps{
  text:string,
  icon: ReactNode,
  link:string
}


export default function AnimatedButton({text="Button", icon, link}: inputProps) {
  return (
    <div className="mt-12">
      <motion.a
        href={link}
        target={'_blank'}
        className="group relative inline-flex bg-black hover:text-black hover:border-black items-center justify-center px-8 py-4 overflow-hidden font-semibold text-white hover:bg-white border hover:border-primary-900 hover:text-primary-900 bg-primary-900 transition-all duration-300"
        variants={buttonVariants}
        initial="rest"
        whileHover="hover"
        whileTap="tap"
      >
        <motion.span className="relative hover:text-black hover:border-black font-title flex items-center overflow-hidden">
          <motion.span
            className="flex items-center justify-center"
            variants={textVariants}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
              {text}
            <motion.span
              className="ml-2"
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              {icon}
            </motion.span>
          </motion.span>
          <motion.span
            className="flex items-center justify-center absolute"
            variants={newTextVariants}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
              {text}
            <motion.span
              className="ml-2"
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >

              {icon}
            </motion.span>
          </motion.span>
        </motion.span>
      </motion.a>
    </div>
  );
}