export const validateNote = (data) => {
  const errors = [];
  
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }
  
  if (!data.content?.trim()) {
    errors.push('Content is required');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateAuth = (data) => {
  const errors = {};
  
  if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Valid email is required';
  }
  
  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
