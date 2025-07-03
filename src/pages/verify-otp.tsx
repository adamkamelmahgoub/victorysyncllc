// pages/verify-otp.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // This useEffect hook runs when the page loads to get the email from the URL
  useEffect(() => {
    if (router.isReady) {
      // The email is passed as a query parameter in the URL
      // e.g., /verify-otp?email=user@example.com
      const userEmail = router.query.email as string;
      if (userEmail) {
        setEmail(userEmail);
      } else {
        setError("Email not found. Please go back to the sign-up page.");
      }
    }
  }, [router.isReady, router.query]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed.');
      }

      // If verification is successful
      setSuccess('Account verified successfully! Redirecting...');

      // Redirect to the login or dashboard page after 2 seconds
      setTimeout(() => {
        router.push('/login'); // Or '/customer-dashboard' if you log them in automatically
      }, 2000);

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Verify Your Account</h1>
      <p>We've sent a 6-digit code to {email}. Please enter it below.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="otp">Verification Code</label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6} // Ensures user can only enter 6 digits
            required
          />
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <button type="submit" disabled={isLoading || !!success}>
          {isLoading ? 'Verifying...' : 'Verify Account'}
        </button>
      </form>
    </div>
  );
}