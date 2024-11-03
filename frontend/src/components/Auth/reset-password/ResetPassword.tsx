import { useState } from 'react';
import { initiatePasswordReset, resetPassword } from '../AuthService'; // Correct the import

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordReset = async () => {
    try {
      await initiatePasswordReset(email);
      alert("A verification code has been sent to your email.");
    } catch (error) {
      console.error("Error during password reset:", error);
      alert("Failed to initiate password reset. Please try again.");
    }
  };

  const handleNewPasswordConfirmation = async () => {
    try {
      await resetPassword(email, verificationCode, newPassword);
      alert("Your password has been reset successfully.");
    } catch (error) {
      console.error("Error confirming new password:", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <>
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Reset Password</h1>
      </div>

      {/* Password Reset Form */}
      <form onSubmit={(e) => { e.preventDefault(); handlePasswordReset(); }}>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="form-input w-full py-2"
              type="email"
              placeholder="corybarker@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow hover:bg-opacity-90">
            Send Verification Code
          </button>
        </div>
      </form>

      {/* New Password Confirmation Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleNewPasswordConfirmation(); }}>
        <div className="space-y-4 mt-10">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="verificationCode">
              Verification Code
            </label>
            <input
              id="verificationCode"
              className="form-input w-full py-2"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="newPassword">
              New Password
            </label>
            <input
              id="newPassword"
              className="form-input w-full py-2"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mt-6">
          <button className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 text-white shadow hover:bg-opacity-90">
            Confirm New Password
          </button>
        </div>
      </form>
    </>
  );
}
