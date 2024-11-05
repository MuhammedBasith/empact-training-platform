import React, { Suspense } from "react";
import { motion } from "framer-motion";


const Loadable = (Component) => (props) =>
(
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);



const loadingContainer = {
  width: "4rem",
  height: "4rem",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
};

const loadingCircle = {
  display: "block",
  width: "1rem",
  height: "1rem",
  backgroundColor: "#00C4B4", // Modern teal color
  borderRadius: "50%", // Perfectly round circles
};

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2,
    },
  },
  end: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const loadingCircleVariants = {
  start: {
    y: "0%",
    opacity: 0.7, // Initial opacity for a smoother effect
  },
  end: {
    y: "60%",
    opacity: 1, // Full opacity when the animation is at its peak
  },
};

const loadingCircleTransition = {
  duration: 0.4,
  yoyo: Infinity,
  ease: "easeInOut",
};

const Loader = () => {
  return (
    <div>
      {/* Background overlay */}
      <div className="fixed w-full min-h-screen z-50 bg-black opacity-20" />
      
      {/* Loader container */}
      <div className="flex fixed w-full justify-center items-center h-screen">
        <motion.div
          style={loadingContainer}
          variants={loadingContainerVariants}
          initial="start"
          animate="end"
        >
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          ></motion.span>
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          ></motion.span>
          <motion.span
            style={loadingCircle}
            variants={loadingCircleVariants}
            transition={loadingCircleTransition}
          ></motion.span>
        </motion.div>
      </div>
    </div>
  );
};



export default Loadable;