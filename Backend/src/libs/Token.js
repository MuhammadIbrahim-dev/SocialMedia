import jwt from 'jsonwebtoken';

if (!process.env.JWT_TOKEN) {
  throw new Error('FATAL_ERROR: JWT_TOKEN is not defined in the environment variables. Please check your .env file.');
}

const GenToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN, {
    expiresIn: '30d',   
  });

  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: isProduction, // Use secure cookies in production
    sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site production, 'lax' for development
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

export default GenToken;