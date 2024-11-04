import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signIn, initiatePasswordReset } from "../AuthService";
import { useUserContext } from "../../../context/UserContext";


export const metadata = {
  title: "Sign In - Empact",
  description: "Page description",
};

export default function SignIn() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerificationRequired, setIsVerificationRequired] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { user } = useUserContext(); // Access the setUser function from context
  const { setUser } = useUserContext();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const checkUserStatus = async (username) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_AUTHENTICATION_MICROSERVICE_BACKEND}/api/auth/checkUserStatus?username=${username}`);
      const data = await response.json();
      return data.isConfirmed;
    } catch (error) {
      console.error("Error checking user confirmation status:", error);
      return false; // Return false on error
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    const isConfirmed = await checkUserStatus(formData.username);
    if (!isConfirmed) {
      setError("Account not confirmed. Please verify your email.");
      setIsVerificationRequired(true);
      return;
    }
  
    try {
      const result = await signIn(formData.username, formData.password, setUser);
      if (result) {
        console.log(result);
  
        // Navigate to role-specific dashboard
        const role = result.role?.toLowerCase(); // Use the role from the result
        console.log(result.role, " from sign in");
  
        if (role && role !== 'nill') {
          navigate(`/dashboard/${role}`);
        } else {
          setError("User role is not defined.");
        }
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("Login failed. " + (err.name === "UserNotConfirmedException" ? "Account not confirmed. Please verify your email." : err.message));
      setIsVerificationRequired(err.name === "UserNotConfirmedException");
    }
  };
  

  const handleVerifyAccount = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_AUTHENTICATION_MICROSERVICE_BACKEND}/api/auth/confirm-new-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: formData.username, newPassword }),
      });

      if (!response.ok) {
        throw new Error('Failed to change password: ' + (await response.text()));
      }

      setSuccessMessage("Password changed successfully. You can now log in.");
      setError('');
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
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="username">
              Email
            </label>
            <input
              id="username"
              className="form-input w-full py-2"
              type="email"
              placeholder="employee@ust.com"
              value={formData.username}
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
        </div>
        <div className="mt-6">
          <button className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%]">
            Sign In
          </button>
        </div>
      </form>
      <div className="mt-6 text-center">
        <Link
          className="text-sm text-gray-700 underline hover:no-underline"
          to="/reset-password"
          onClick={handleInitiatePasswordReset}
        >
          Forgot password
        </Link>
      </div>

      {/* Verification section */}
      {isVerificationRequired && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Verify Your Account</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input w-full py-2"
          />
          <button className="btn mt-2" onClick={handleVerifyAccount}>
            Verify Account
          </button>
        </div>
      )}

      {/* Error and success messages */}
      {error && <p className="text-red-500">{error}</p>}
      {successMessage && <p className="text-green-500">{successMessage}</p>}
    </>
  );
}
