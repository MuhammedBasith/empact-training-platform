import { useState } from "react";

export const metadata = {
  title: "Sign Up - Simple",
  description: "Page description",
};

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
    role: "Employee", // Default role
  });
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // Validate form inputs
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await response.json();

      if (data.success) {
        setOtpSent(true); // Enable OTP section
      } else {
        setError("Failed to create account. Please try again.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async () => {
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          otp,
        }),
      });
      const data = await response.json();

      if (data.success) {
        // Redirect to login
        window.location.href = "/signin";
      } else {
        setOtpError("Invalid OTP. Please try again.");
      }
    } catch (error) {
      setOtpError("An error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Create your account</h1>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="name"
            >
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
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="email"
            >
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
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
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
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="repeatPassword"
            >
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
            <label
              className="mb-1 block text-sm font-medium text-gray-700"
              htmlFor="role"
            >
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
            </select>
          </div>
        </div>
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

      {/* Bottom link */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          By signing up, you agree to the{" "}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            className="whitespace-nowrap font-medium text-gray-700 underline hover:no-underline"
            href="#0"
          >
            Privacy Policy
          </a>
          .
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <a
            className="font-medium text-blue-500 underline hover:no-underline"
            href="/signin"
          >
            Log in
          </a>
        </p>
      </div>
    </>
  );
}
