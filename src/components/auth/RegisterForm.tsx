import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { registerSchema, RegisterFormData, validatePasswordStrength } from '@/schemas/auth.schemas';
import { createRateLimiter } from '@/utils/validators';
import { showSuccess, showError } from '@/utils/notifications';
import clsx from 'clsx';

// Rate limiter for registration attempts
const registerRateLimiter = createRateLimiter(3, 60 * 60 * 1000); // 3 attempts per hour

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<{
    isValid: boolean;
    score: number;
    feedback: string[];
  } | null>(null);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isAllowed: boolean;
    remainingAttempts: number;
    resetTime?: number;
  } | null>(null);

  const { register: registerUser, error: authError, clearError } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    setError,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchedPassword = watch('password');

  // Monitor password strength
  React.useEffect(() => {
    if (watchedPassword) {
      const strength = validatePasswordStrength(watchedPassword);
      setPasswordStrength({
        isValid: strength.isValid,
        score: strength.score,
        feedback: strength.errors,
      });
    } else {
      setPasswordStrength(null);
    }
  }, [watchedPassword]);

  const onSubmit = async (data: RegisterFormData) => {
    // Check rate limiting
    const rateLimit = registerRateLimiter(data.email);
    setRateLimitInfo(rateLimit);

    if (!rateLimit.isAllowed) {
      const resetTime = new Date(rateLimit.resetTime!);
      showError(
        `Too many registration attempts. Please try again after ${resetTime.toLocaleTimeString()}`
      );
      return;
    }

    setIsSubmitting(true);
    clearError();

    try {
      await registerUser(data);
      showSuccess(`Registration successful! Welcome, ${data.username}!`);
      reset();
      navigate('/dashboard');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed';
      showError(errorMessage);
      
      // Set form error for better UX
      setError('root', {
        type: 'manual',
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const getPasswordStrengthColor = (score: number) => {
    if (score <= 1) return 'text-red-500';
    if (score <= 2) return 'text-orange-500';
    if (score <= 3) return 'text-yellow-500';
    if (score <= 4) return 'text-blue-500';
    return 'text-green-500';
  };

  const getPasswordStrengthText = (score: number) => {
    if (score <= 1) return 'Very Weak';
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Fair';
    if (score <= 4) return 'Good';
    return 'Strong';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-600 dark:bg-green-600">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400 dark:text-gray-400">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 dark:text-gray-300">
                Username
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('username')}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className={clsx(
                    'appearance-none relative block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 text-white bg-gray-800 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                    errors.username
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-600'
                  )}
                  placeholder="Choose a username"
                />
              </div>
              {errors.username && (
                <div className="mt-1 flex items-center text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.username.message}
                </div>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 dark:text-gray-300">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email')}
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={clsx(
                    'appearance-none relative block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 text-white bg-gray-800 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                    errors.email
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-600'
                  )}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <div className="mt-1 flex items-center text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.email.message}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={clsx(
                    'appearance-none relative block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 text-white bg-gray-800 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                    errors.password
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-600'
                  )}
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {passwordStrength && watchedPassword && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Password strength:</span>
                    <span className={clsx('font-medium', getPasswordStrengthColor(passwordStrength.score))}>
                      {getPasswordStrengthText(passwordStrength.score)}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={clsx(
                        'h-2 rounded-full transition-all duration-300',
                        getPasswordStrengthColor(passwordStrength.score).replace('text-', 'bg-')
                      )}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    ></div>
                  </div>
                  {passwordStrength.feedback.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600">
                      <ul className="space-y-1">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <li key={index} className="flex items-center">
                            <AlertCircle className="h-3 w-3 mr-1 text-yellow-500" />
                            {feedback}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              
              {errors.password && (
                <div className="mt-1 flex items-center text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.password.message}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={clsx(
                    'appearance-none relative block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 text-white bg-gray-800 border-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm',
                    errors.confirmPassword
                      ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-600'
                  )}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-1 flex items-center text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.confirmPassword.message}
                </div>
              )}
            </div>
          </div>

          {/* Rate Limit Warning */}
          {rateLimitInfo && !rateLimitInfo.isAllowed && (
            <div className="rounded-md bg-yellow-900/50 border border-yellow-600 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-300">
                    Too many registration attempts
                  </h3>
                  <div className="mt-2 text-sm text-yellow-200">
                    <p>
                      Please wait before trying again. You can try again after{' '}
                      {rateLimitInfo.resetTime &&
                        new Date(rateLimitInfo.resetTime).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Auth Error */}
          {authError && (
            <div className="rounded-md bg-red-900/50 border border-red-600 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">Registration Error</h3>
                  <div className="mt-2 text-sm text-red-200">
                    <p>{authError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Form Error */}
          {errors.root && (
            <div className="rounded-md bg-red-900/50 border border-red-600 p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">Form Error</h3>
                  <div className="mt-2 text-sm text-red-200">
                    <p>{errors.root.message}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="flex items-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 bg-gray-800 rounded"
            />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-300">
              I agree to the{' '}
              <a href="#" className="text-blue-400 hover:text-blue-300">
                Terms and Conditions
              </a>
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className={clsx(
                'group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-gray-900',
                isSubmitting || !isValid
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              )}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </div>

          {/* Rate Limit Info */}
          {rateLimitInfo && rateLimitInfo.isAllowed && rateLimitInfo.remainingAttempts < 3 && (
            <div className="text-center text-sm text-yellow-400">
              {rateLimitInfo.remainingAttempts} registration attempts remaining
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegisterForm; 