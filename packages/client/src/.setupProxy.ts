import { createProxyMiddleware } from 'http-proxy-middleware';

const proxy = {
  target: `http://127.0.0.1:5001/`,
  headers: {
    "Connection": "keep-alive"
  },
  changeOrigin: true,
};

module.exports = (app) => {
  app.use('/backend', createProxyMiddleware(proxy));
};
