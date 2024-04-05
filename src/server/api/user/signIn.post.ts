import { Response, ErrorResponse, STATUS_CODES } from '~/server/util/Response';
import { getHash, generateToken } from '~/server/util/token';

export interface UserInfo {
  userName: string;
  userHash: string;
  createdAt: string;
  lastLoginAt?: string;
}

export default defineEventHandler(async (event) => {
  const { userName, password } = await readBody(event);
  if (!userName || !password) {
    throw new ErrorResponse({
      message: 'Invalid Parameter',
      errorCode: 'undefined'
    }, STATUS_CODES.BAD_REQUEST);
  }
  const userKey = `${userName.trim()}`;
  const userHash = getHash(`${userName}${password}`);

  const storage = useStorage('user');
  const isSignedIn = await storage.hasItem(userKey);
  let userInfo: UserInfo;

  // 기존 사용자
  if (isSignedIn) {
    userInfo = await storage.getItem<UserInfo>(userKey) as UserInfo;

    // Password Validation
    if (userInfo.userHash !== userHash) {
      return new ErrorResponse({
        message: 'Wrong Password',
        errorCode: 'reject_signin'
      }, STATUS_CODES.UNAUTHORIZED);
    }

    userInfo = {
      ...userInfo,
      lastLoginAt: (new Date()).toISOString()
    };
  } else {
  // 신규 사용자
    userInfo = {
      userName,
      userHash,
      createdAt: (new Date()).toISOString()
    };
  }

  await storage.setItem<UserInfo>(userKey, userInfo);

  const token = generateToken(userInfo);
  return new Response<UserInfo & {token: string}>({
    ...userInfo,
    token
  });
});
