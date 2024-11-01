import React from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { TextArea } from "./ui/textArea";

const RequirementsForm: React.FC = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Welcome to Empact!
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Aut mollitia dolorem temporibus qui delectus distincti
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="trainingname">Training Name</Label>
          <Input id="trainingname" placeholder="Technical/Soft Skills" type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="targetaudience">Target Audience</Label>
          <Input id="targetaudience" placeholder="Department/Role" type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="outcomes">Desired Outcomes</Label>
          <TextArea id="outcomes" placeholder="Outcomes" type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="durationpreference">Duration Preference</Label>
          <Input id="durationpreference" placeholder="Weeks" type="number" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="Preferredtimeframe">Preferred Time Frame</Label>
          <Input id="Preferredtimeframe" placeholder="Date" type="date" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="deliverymode">Delivery Mode</Label>
          <GlowSelect id="deliverymode">
            <option value="" disabled>Select</option>
            <option value="hybrid">Hybrid</option>
            <option value="online">Online</option>
            <option value="remote">Remote</option>
          </GlowSelect>
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="Prerequisites">Prerequisites</Label>
          <Input id="Prerequisites" placeholder="Any Skills" type="text" />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="trained">Skills to be trained</Label>
          <Input id="trained" placeholder="Skills" type="text" />
        </LabelInputContainer>

        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-transform duration-200 ease-in-out transform hover:scale-105"
          type="submit"
        >
          Submit &rarr;
          <BottomGradient />
        </button>

      </form>
    </div>
  );
};

const GlowSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    const radius = 100; // Change this to increase the radius of the hover effect
    const [visible, setVisible] = React.useState(false);
    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);

    function handleMouseMove({ currentTarget, clientX, clientY }: any) {
      let { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    }

    return (
      <motion.div
        style={{
          background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            var(--blue-500),
            transparent 80%
          )
        `,
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        className="p-[2px] rounded-lg transition duration-300 group/select"
      >
        <select
          ref={ref}
          className={cn(
            `flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 text-black dark:text-white shadow-input rounded-md px-3 py-2 text-sm 
            focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600
            disabled:cursor-not-allowed disabled:opacity-50
            group-hover/select:shadow-none transition duration-400`,
            className
          )}
          {...props}
        >
          {children}
        </select>
      </motion.div>
    );
  }
);
GlowSelect.displayName = "GlowSelect";

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

export default RequirementsForm;
