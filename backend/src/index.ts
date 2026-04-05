import express from 'express';
import cors from 'cors';
import { simulateController } from './controllers/simulate.controller';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simulation Endpoint
app.post('/api/simulate', simulateController);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
