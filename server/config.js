import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  SID : process.env.SID,
  AUTH : process.env.AUTH,
  NUMBER: process.env.NUMBER

};