export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    return res.status(400).json({ 
      error: 'Validation Error',
      details: err.errors 
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Authentication Error',
      message: 'Invalid token' 
    });
  }

  res.status(500).json({ 
    error: 'Server Error',
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong' 
      : err.message 
  });
};

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
