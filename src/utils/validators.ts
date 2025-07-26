// Custom validation functions for forms

// Email validation with additional checks
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  
  // Check for common disposable email domains
  const disposableDomains = [
    'tempmail.org',
    'guerrillamail.com',
    '10minutemail.com',
    'mailinator.com',
    'yopmail.com',
  ];
  
  const domain = email.split('@')[1]?.toLowerCase();
  if (domain && disposableDomains.includes(domain)) {
    return { isValid: false, error: 'Please use a valid email address' };
  }
  
  return { isValid: true };
};

// Username validation
export const validateUsername = (username: string): { isValid: boolean; error?: string } => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }
  
  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }
  
  if (username.length > 30) {
    return { isValid: false, error: 'Username must be less than 30 characters' };
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }
  
  // Check for reserved usernames
  const reservedUsernames = [
    'admin',
    'administrator',
    'root',
    'system',
    'support',
    'help',
    'info',
    'contact',
    'noreply',
    'no-reply',
  ];
  
  if (reservedUsernames.includes(username.toLowerCase())) {
    return { isValid: false, error: 'This username is reserved' };
  }
  
  return { isValid: true };
};

// Password strength validation with detailed feedback
export const validatePassword = (password: string): {
  isValid: boolean;
  score: number; // 0-4 scale
  feedback: string[];
  error?: string;
} => {
  const feedback: string[] = [];
  let score = 0;
  
  if (!password) {
    return { isValid: false, score: 0, feedback: [], error: 'Password is required' };
  }
  
  if (password.length < 6) {
    return { isValid: false, score: 0, feedback: [], error: 'Password must be at least 6 characters' };
  }
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Consider using at least 8 characters');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add lowercase letters');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add uppercase letters');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add numbers');
  }
  
  // Special character check
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Add special characters for extra security');
  }
  
  const isValid = score >= 3; // Require at least 3 out of 5 criteria
  
  return {
    isValid,
    score,
    feedback,
    error: isValid ? undefined : 'Password does not meet security requirements',
  };
};

// Password confirmation validation
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): { isValid: boolean; error?: string } => {
  if (!confirmPassword) {
    return { isValid: false, error: 'Please confirm your password' };
  }
  
  if (password !== confirmPassword) {
    return { isValid: false, error: "Passwords don't match" };
  }
  
  return { isValid: true };
};

// Rate limiting validation
export const createRateLimiter = (maxAttempts: number, timeWindow: number) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();
  
  return (identifier: string): { isAllowed: boolean; remainingAttempts: number; resetTime?: number } => {
    const now = Date.now();
    const userAttempts = attempts.get(identifier);
    
    if (!userAttempts || now > userAttempts.resetTime) {
      // Reset or create new entry
      attempts.set(identifier, {
        count: 1,
        resetTime: now + timeWindow,
      });
      return { isAllowed: true, remainingAttempts: maxAttempts - 1 };
    }
    
    if (userAttempts.count >= maxAttempts) {
      return {
        isAllowed: false,
        remainingAttempts: 0,
        resetTime: userAttempts.resetTime,
      };
    }
    
    // Increment attempt count
    userAttempts.count += 1;
    attempts.set(identifier, userAttempts);
    
    return {
      isAllowed: true,
      remainingAttempts: maxAttempts - userAttempts.count,
    };
  };
};

// Form field validation with debouncing
export const createDebouncedValidator = <T>(
  validator: (value: T) => { isValid: boolean; error?: string },
  delay: number = 500
) => {
  let timeoutId: NodeJS.Timeout;
  
  return (value: T): Promise<{ isValid: boolean; error?: string }> => {
    return new Promise((resolve) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        resolve(validator(value));
      }, delay);
    });
  };
}; 