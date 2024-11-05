import { useState } from "react";
import { signUp, confirmSignUp } from "../AuthService";

export const metadata = {
  title: "Sign Up - Empact",
  description: "Page description",
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "Employee",
    expertise: "",
    bio: "",
    account: "",
    skills: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match.");
      return false;
    }
    if (!formData.email.endsWith("@ust.com")) {
      setError("Email must be a valid ust.com email address.");
      return false;
    }
    setError("");
    return true;
  };

  // Handle the initial sign-up (this is common for all roles)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // Perform the initial sign-up request to Cognito
      const response = await signUp(formData.email, formData.password, formData.name, formData.role);
      const cognitoId = await response.response.UserSub;

      // Now send the common sign-up info to the authentication service
      const responseFromBackend = await fetch(`${import.meta.env.VITE_APP_AUTHENTICATION_MICROSERVICE_BACKEND}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cognitoId, // Send the Cognito ID
          email: formData.email,
          name: formData.name,
          role: formData.role,
        }),
      });

      if (!responseFromBackend.ok) {
        throw new Error('Failed to create account: ' + (await responseFromBackend.text()));
      }

      // If sign-up is successful, check role and send additional data to respective microservices
      if (formData.role === "Trainer") {
        await sendTrainerData(cognitoId);
      } else if (formData.role === "Employee") {
        await sendEmployeeData(cognitoId);
      }

      console.log("Sign up success:", await responseFromBackend.json());
      setOtpSent(true); // Enable OTP section

    } catch (err) {
      setError("Failed to create account. " + err.message);
    }
  };

  // Send Trainer-specific data to the backend
  const sendTrainerData = async (cognitoId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_TRAINER_MICROSERVICES_URL}/api/v1/trainer-management/trainer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cognitoId,
          name: formData.name,
          email: formData.email,
          expertise: formData.expertise,
          bio: formData.bio,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send trainer data.");
      }

      console.log("Trainer data submitted successfully!");
    } catch (err) {
      console.error("Error submitting trainer data:", err);
    }
  };

  // Send Employee-specific data to the backend
  const sendEmployeeData = async (cognitoId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_EMPLOYEE_MICROSERVICES_URL}/api/v1/employee-management`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cognitoId,
          empName: formData.name,
          empEmail: formData.email,
          empAccount: formData.account,
          empSkills: formData.skills,
          empDepartment: formData.department,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send employee data.");
      }

      console.log("Employee data submitted successfully!");
    } catch (err) {
      console.error("Error submitting employee data:", err);
    }
  };

  // Confirm the OTP and get tokens
  const handleOtpSubmit = async () => {
    try {
      const result = await confirmSignUp(formData.email, otp);
      if (result) {
        // After successful confirmation, redirect to login or home page
        window.location.href = "/signin";
      }
    } catch (err) {
      setOtpError("Invalid OTP. " + err.message);
    }
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Create your account</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="name">
              Full name
            </label>
            <input
              id="name"
              className="form-input w-full py-2"
              type="text"
              placeholder="Corey Barker"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-input w-full py-2"
              type="email"
              placeholder="corybarker@ust.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="form-input w-full py-2"
              type="password"
              autoComplete="on"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="repeatPassword">
              Repeat Password
            </label>
            <input
              id="repeatPassword"
              className="form-input w-full py-2"
              type="password"
              autoComplete="on"
              placeholder="••••••••"
              value={formData.repeatPassword}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="form-select w-full py-2"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="Employee">Employee</option>
              <option value="Manager">Manager</option>
              <option value="Trainer">Trainer</option>
            </select>
          </div>
        </div>

        {formData.role === "Trainer" && (
          <>
            <div className="mb-4">
              <label className="mb-1 mt-3 block text-sm font-medium text-gray-700" htmlFor="expertise">
                Expertise
              </label>
              <input
                id="expertise"
                className="form-input w-full py-2"
                type="text"
                placeholder="Your area of expertise"
                value={formData.expertise}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="bio">
                Bio
              </label>
              <textarea
                id="bio"
                className="form-input w-full py-2"
                placeholder="Brief biography"
                value={formData.bio}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}

        {formData.role === "Employee" && (
          <>
            <div className="mb-4">
              <label className="mb-1 mt-3 block text-sm font-medium text-gray-700" htmlFor="account">
                Account
              </label>
              <input
                id="account"
                className="form-input w-full py-2"
                type="text"
                placeholder="Your account Name"
                value={formData.account}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="skills">
                Skills
              </label>
              <input
                id="skills"
                className="form-input w-full py-2"
                type="text"
                placeholder="Your skills"
                value={formData.skills}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="department">
                Department
              </label>
              <input
                id="department"
                className="form-input w-full py-2"
                type="text"
                placeholder="Your department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
          </>
        )}


        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div className="mt-6 space-y-3">
          <button
            type="submit"
            className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]"
          >
            Register
          </button>
        </div>
      </form>

      {otpSent && (
        <div className="mt-6 space-y-4">
          <p>Enter the OTP sent to {formData.email}</p>
          <input
            type="text"
            className="form-input w-full py-2"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button
            onClick={handleOtpSubmit}
            className="btn w-full bg-blue-500 text-white shadow"
          >
            Verify OTP
          </button>
          {otpError && <p className="text-red-500 text-sm mt-2">{otpError}</p>}
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By signing up, you agree to the{" "}
          <a className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline" href="#0">
            Terms of Service
          </a>{" "}
          and{" "}
          <a className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline" href="#0">
            Privacy Policy
          </a>.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <a className="font-medium text-blue-500 underline hover:no-underline" href="/signin">
            Log in
          </a>
        </p>
      </div>
    </>
  );
}
