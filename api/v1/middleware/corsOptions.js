// corsOptions.js
const corsOptions = {
    origin: (origin, callback) => {
      // List of allowed origins
      const allowedOrigins = [
        'https://lolvue.vercel.app', 
        'https://lolvue-r3flexmlgs-projects.vercel.app', 
        'http://localhost:54545',
        'http://localhost:5173'
      ];
  
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
  
      // Check if the origin is in the list of allowed origins
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204
  };
  
  module.exports = corsOptions;
  