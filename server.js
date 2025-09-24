import axios from 'axios';
import express from 'express';

function createServer(port, origin) {
  const app = express();

  app.use(express.json());

  app.use(async (req, res) => {
    const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    try {
      const response = await axios({
        method: req.method,
        url: `${cleanOrigin}${req.originalUrl}`,
        data: req.body,
        headers: {
          ...req.headers,
          host: undefined,
          'accept-encoding': undefined,
        },
        validateStatus: (status) => status < 400,
      });

      res.set('X-Cache', 'MISS');
      res.status(response.status).json(response.data);
    } catch (error) {
      console.error('Error forwarding request:', error.message);
      res.status(500).json({ error: 'Proxy error' });
    }
  });

  app.listen(port, () => {
    console.log(`Caching proxy server is running on http://localhost:${port}`);
  });
}

export { createServer };
