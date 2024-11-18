import express, { Request, Response } from 'express';
import httpProxy from 'http-proxy';
import cors from 'cors';
import 'dotenv/config';

// Create the express app
const app = express();
const port = process.env.PORT || 3000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Proxy setup
const target = 'http://43.205.196.66:3001'; // Target EC2 endpoint
const proxy = httpProxy.createProxyServer({ target });

// Route to forward requests
app.all('*', (req: Request, res: Response) => {
  console.log(`[Proxy] Routing request: ${req.method} ${req.originalUrl}`);
  
  proxy.web(req, res, { target }, (err) => {
    console.error('[Proxy Error]', err);
    res.status(500).json({ message: 'Proxy failed to route the request.' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Dummy server is running on http://localhost:${port}`);
});
