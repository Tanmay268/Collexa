import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Frontend should be running on: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
    console.log(`Backend API available at: http://localhost:${PORT}/api`);
  }
});
