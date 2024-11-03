import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, initiatePasswordReset, confirmNewPassword } from "../AuthService"; // Adjust the import path as necessary

export const metadata = {
    title: "Sign In - Simple",
    description: "Page description",
};

export default function SignIn() {
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isVerificationRequired, setIsVerificationRequired] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate(); // Hook to programmatically navigate

    const handleChange = (e: any) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const checkUserStatus = async (username: string) => {
          try {
              const response = await fetch(`${import.meta.env.VITE_APP_AUTHENTICATION_MICROSERVICE_BACKEND}/api/auth/checkUserStatus?username=${username}`);
              const data = await response.json();
              return data.isConfirmed;
          } catch (error) {
              console.error("Error checking user confirmation status:", error);
          }
      };

        try {
            // Check if user is confirmed
            // const isConfirmed = await isUserConfirmed(formData.username);
            // const isConfirmed = true
            const isConfirmed = await checkUserStatus(formData.username)
            console.log(isConfirmed)

            if (!isConfirmed) {
                setError("Account not confirmed. Please verify your email.");
                setIsVerificationRequired(true);
                return;
            }

            // Sign in the user
            const result = await signIn(formData.username, formData.password);
            if (result) {
                // Redirect to the home page or another page
                navigate("/home");
            } else {
                setError("Invalid credentials. Please try again.");
            }
        } catch (err) {
            if (err.name === "UserNotConfirmedException") {
                setError("Account not confirmed. Please verify your email.");
                setIsVerificationRequired(true);
            } else {
                setError("Login failed. " + err.message);
            }
        }
    };

    const handleVerifyAccount = async () => {
        try {
            await confirmNewPassword(formData.username, verificationCode, newPassword);
            setSuccessMessage("Password changed successfully. You can now log in.");
            setIsVerificationRequired(false);
        } catch (err) {
            setError("Failed to change password: " + err.message);
        }
    };

    const handleInitiatePasswordReset = async () => {
        try {
            await initiatePasswordReset(formData.username);
            setSuccessMessage("Password reset email sent. Please check your inbox.");
        } catch (err) {
            setError("Failed to initiate password reset: " + err.message);
        }
    };

    return (
        <>
            <div className="mb-10">
                <h1 className="text-4xl font-bold">Sign in to your account</h1>
            </div>
            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <label
                            className="mb-1 block text-sm font-medium text-gray-700"
                            htmlFor="username"
                        >
                            Email
                        </label>
                        <input
                            id="username" // Changed to username to align with AWS Cognito's expectations
                            className="form-input w-full py-2"
                            type="email"
                            placeholder="employee@ust.com"
                            value={formData.username}
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
                </div>
                <div className="mt-6">
                    <button className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]">
                        Sign In
                    </button>
                </div>
            </form>
            {/* Bottom link */}
            <div className="mt-6 text-center">
                <Link
                    className="text-sm text-gray-700 underline hover:no-underline"
                    to="/reset-password"
                    onClick={handleInitiatePasswordReset} // Initiate password reset process
                >
                    Forgot password
                </Link>
            </div>

            {/* Verification section */}
            {isVerificationRequired && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold">Verify Your Account</h2>
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="form-input w-full py-2 mt-2"
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="form-input w-full py-2 mt-2"
                    />
                    <button
                        onClick={handleVerifyAccount}
                        className="btn mt-4 w-full bg-gradient-to-t from-green-600 to-green-500 text-white"
                    >
                        Verify and Set New Password
                    </button>
                </div>
            )}

            {/* Success message */}
            {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
            {/* Error message */}
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </>
    );
}
