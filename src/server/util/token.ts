import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserInfo } from '~/types/user';
import { STATUS_CODES } from './Response';
const secretKey: string = process.env.TOKEN_SECRET_KEY || 'user-dashboard-secret-key';

export const generateToken = (userInfo: UserInfo) => {
  const payload = {
    userName: userInfo.userName,
    userHash: userInfo.userHash
  };
  return jwt.sign(payload, secretKey, { algorithm: 'HS256', expiresIn: '1h' });
};

export const refreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log(decoded);
    const payload = {
      userName: decoded.userName,
      userHash: decoded.userHash
    };
    return generateToken(payload);
  } catch (error) {
    console.error('Error refreshing token:', error);
    return null;
  }
};

export const verifyToken = (token: string) => {
  if (!token) { return null; }
  return jwt.verify(token, secretKey, (error, decoded) => {
    if (error) {
      throw createError({
        statusCode: STATUS_CODES.UNAUTHORIZED,
        statusMessage: 'Unauthorized'
      });
    }
    return decoded;
  });
};

export const getHash = (payload: string) => {
  return crypto.createHash('sha512').update(payload).digest('base64');
};
