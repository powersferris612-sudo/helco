import express from 'express';
import { config } from './core/config';
import { v1Router } from './api/v1';

const app = express();

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/v1', v1Router);

app.listen(config.port, () => {
  // no-op startup log removed to keep scaffold quiet
});