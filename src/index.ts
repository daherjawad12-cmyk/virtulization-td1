import express, { Request, Response } from 'express';

export const app = express();
const PORT = process.env.PORT || 8000;

// Route principale
app.get('/api/v1/sysinfo', async (_req: Request, res: Response) => {
  try {
    const info = await getSystemInformation();
    res.status(200).json({
      ...info,
      test: 'hello world2',
    });
  } catch (err) {
    console.error('Error while fetching system info:', err);
    res.status(500).json({ error: 'unable to read system information' });
  }
});

// Toutes les autres routes → 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'not found' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
import * as si from 'systeminformation';

export async function getSystemInformation() {
  const [
    cpu,
    system,
    mem,
    os,
    currentLoad,
    processes,
    diskLayout,
    networkInterfaces,
  ] = await Promise.all([
    si.cpu(),
    si.system(),
    si.mem(),
    si.osInfo(),
    si.currentLoad(),
    si.processes(),
    si.diskLayout(),
    si.networkInterfaces(),
  ]);

  return {
    cpu,
    system,
    mem,
    os,
    currentLoad,
    processes,
    diskLayout,
    networkInterfaces,
  };
}
