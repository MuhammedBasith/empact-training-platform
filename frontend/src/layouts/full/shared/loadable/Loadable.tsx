import { Suspense } from "react";
import { motion } from "framer-motion";


const Loadable = (Component) => (props) =>
(
  <Suspense fallback={<Loader />}>
    <Component {...props} />
  </Suspense>
);



const loadingContainer = {
  width: "6rem",  // Increased size of the container for bigger balls
  height: "6rem", 
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
};

const loadingCircle = {
  display: "block",
  width: "1.5rem",  // Increased size of the loading circle
  height: "1.5rem",
  backgroundColor: "black", // Modern teal color
  borderRadius: "50%", // Perfectly round circles
};

const loadingContainerVariants = {
  start: {
    transition: {
      staggerChildren: 0.2, // Stagger the animation for each circle
      repeat: Infinity,      // Ensure animation repeats infinitely
      repeatType: "loop",    // The animation will loop until interrupted
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
    y: "0%",      // Start position
    opacity: 0.7, // Initial opacity
  },
  end: {
    y: "60%",     // Move circles vertically
    opacity: 1,   // Full opacity when the animation is at its peak
  },
};

const loadingCircleTransition = {
  duration: 0.4,
  yoyo: Infinity,      // The circles will animate back and forth
  ease: "easeInOut",   // Smooth easing for the motion
  repeat: Infinity,    // Ensures infinite repeat
};

const Loader = () => {
  return (
    <div>
      {/* Background overlay with white color */}
      <div className="fixed w-full min-h-screen z-50 bg-white opacity-90" />
      
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