import cors from 'cors';

const corsOptions = {
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

export default cors(corsOptions);
