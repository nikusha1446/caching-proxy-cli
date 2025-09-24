import axios from 'axios';
import express from 'express';
import NodeCache from 'node-cache';

const cache = new NodeCache();

function createServer(port, origin) {
  const app = express();

  app.use(express.json());

  app.delete('/cache', (req, res) => {
    const keys = cache.keys();
    if (keys.length > 0) {
      cache.flushAll();
      res.json({
        message: 'Cache cleared successfully.',
        removedItems: keys.length,
      });
    } else {
      console.log('Cache is already empty.');
      res.json({
        message: 'Cache is already empty.',
        removedItems: 0,
      });
    }
  });

  app.use(async (req, res) => {
    const cleanOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;

    const cacheKey = `${req.method}:${req.originalUrl}`;
    const cachedResponse = cache.get(cacheKey);

    if (cachedResponse) {
      res.set('X-Cache', 'HIT');
      return res.status(cachedResponse.status).json(cachedResponse.data);
    }

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

      cache.set(cacheKey, {
        status: response.status,
        data: response.data,
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
