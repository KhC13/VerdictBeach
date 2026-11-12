import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = Number(process.env.PORT || 5000);
try {
  await connectDB();
  app.listen(PORT, () => console.log(`VERDICT BEACH API listening on port ${PORT}`));
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
