import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { TextArea } from "./ui/textArea";
import { useUserContext } from "../context/UserContext";  // Import user context
import axios from "axios";
import { useNavigate } from "react-router-dom";  // for redirection
import { Paper } from "@mui/material";

const RequirementsForm: React.FC = () => {
  const { user } = useUserContext(); // Get user context
  const [formData, setFormData] = useState({
    // targetAudience: "",
    trainingType: "",
    department: "",
    trainingName: "",
    // outcomes: "",
    duration: "",
    objectives: "",
    prerequisite: "",
    preferredTimeFrame: "",
    // deliveryMode: "",
    skills_to_train: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false); // To show the summary once it's received
  const [responseData, setResponseData] = useState<any>(null);
  const [editable, setEditable] = useState(false);  // To toggle between edit and view modes
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      console.error("User not found");
      return;
    }

    setLoading(true);

    // Prepare the data to send to backend
    const requestData = {
      cognitoId: user.cognitoID,
      ...formData

      // managerCognitoID: user.cognitoID,
    };
    console.log(requestData)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/`,
        requestData
      );
      console.log(response.data)
      setResponseData(response.data); // Store the response
      setLoading(false);
      setShowSummary(true); // Show the summary after the data is returned
    } catch (error) {
      console.error("Error submitting data", error);
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditable(true);
  };

  const handleOk = () => {
    setEditable(false);  // Exit edit mode after clicking OK
  };

  const handleConfirm = async () => {
    setConfirmationDialogOpen(true);
  };

  const handleConfirmYes = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_APP_TRAINING_REQUIREMENTS_MICROSERVICE_BACKEND}/api/v1/training-requirements/confirmRequirement/${responseData.trainingRequirementId}`,
        {
          ...responseData,
          status: true, // or true based on the backend logic
        }
      );

      // If success, redirect to the dashboard
      if (response.status === 200) {
        navigate("/dashboard/manager");
      }
    } catch (error) {
      console.error("Error updating the status", error);
      setLoading(false);
    }
  };

  const handleConfirmNo = () => {
    setConfirmationDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <p>Submitting data...</p>
        {/* Replace with a real spinner or animation */}
      </div>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, margin: '20px auto' }}>
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
        {!showSummary ? (
          <>
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
              Welcome to Empact!
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
              Please fill out the following form with your training requirements.
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="trainingname">Training Name</Label>
                <Input
                  id="trainingname"
                  value={formData.trainingName}
                  onChange={(e) => setFormData({ ...formData, trainingName: e.target.value })}
                  placeholder="Technical/Soft Skills"
                  type="text"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="targetaudience">Target Audience</Label>
                <Input
                  id="targetaudience"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="Department/Role"
                  type="text"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="outcomes">Desired Outcomes</Label>
                <TextArea
                  id="outcomes"
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  placeholder="Outcomes"
                  type="text"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="durationpreference">Duration Preference</Label>
                <Input
                  id="durationpreference"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="Weeks"
                  type="number"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="Preferredtimeframe">Preferred Time Frame</Label>
                <Input
                  id="Preferredtimeframe"
                  value={formData.preferredTimeFrame}
                  onChange={(e) => setFormData({ ...formData, preferredTimeFrame: e.target.value })}
                  placeholder="Date"
                  type="date"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="deliverymode">Delivery Mode</Label>
                <GlowSelect
                  id="deliverymode"
                  value={formData.trainingType}
                  onChange={(e) => setFormData({ ...formData, trainingType: e.target.value })}
                >
                  <option value="" disabled>Select</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="online">Online</option>
                  <option value="remote">Remote</option>
                </GlowSelect>
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="Prerequisites">Prerequisites</Label>
                <Input
                  id="Prerequisite"
                  value={formData.prerequisite}
                  onChange={(e) => setFormData({ ...formData, prerequisite: e.target.value })}
                  placeholder="Any Skills"
                  type="text"
                />
              </LabelInputContainer>
              <LabelInputContainer className="mb-4">
                <Label htmlFor="trained">Skills to be trained</Label>
                <Input
                  id="trained"
                  value={formData.skills_to_train}
                  onChange={(e) => setFormData({ ...formData, skills_to_train: e.target.value })}
                  placeholder="Skills"
                  type="text"
                />
              </LabelInputContainer>

              <button
                className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] transition-transform duration-200 ease-in-out transform hover:scale-105"
                type="submit"
              >
                Submit &rarr;
                <BottomGradient />
              </button>
            </form>
          </>
        ) : (

          <div>
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 mb-4">
              Training Requirement Summary
            </h2>
            <div className="space-y-3">
              <p><strong>Training Name:</strong> {responseData.trainingName}</p>
              <p><strong>Training Type:</strong> {responseData.trainingType}</p>
              <p><strong>Department:</strong> {responseData.department}</p>
              <p><strong>Duration (Weeks):</strong> {responseData.duration}</p>

              <TextArea
                className="mt-4"
                value={responseData.summary}
                disabled={!editable}
                onChange={(e) => setResponseData({ ...responseData, summary: e.target.value })}
                style={{ minHeight: '200px' }} // Increased height slightly
              />
            </div>

            <div className="flex mt-4 space-x-4">
              <button
                className="bg-blue-500 text-white p-2 rounded-md"
                onClick={editable ? handleOk : handleEdit}
              >
                {editable ? "OK" : "Edit"}
              </button>
              <button
                className="bg-green-500 text-white p-2 rounded-md"
                onClick={handleConfirm}
              >
                Confirm
              </button>
            </div>

            {confirmationDialogOpen && (
              <div className="mt-4">
                <p>Are you sure you want to submit the requirement for {responseData.trainingName}?</p>
                <div className="flex space-x-4">
                  <button className="bg-red-500 text-white p-2 rounded-md" onClick={handleConfirmYes}>Yes</button>
                  <button className="bg-gray-500 text-white p-2 rounded-md" onClick={handleConfirmNo}>No</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Paper>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};

const GlowSelect = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => {
    const radius = 100;
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

export default RequirementsForm;
