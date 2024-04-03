import { Response, ErrorResponse, STATUS_CODES } from '~/server/util/Response';

interface UserInfo {
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
  const userKey = `${userName}`;
  const userHash = `${password}${password}`;

  const storage = useStorage('redis');
  const isSignedIn = await storage.hasItem(userKey);
  // 기존 사용자
  if (isSignedIn) {
    let userInfo = await storage.getItem<UserInfo>(userKey) as UserInfo;

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
    await storage.setItem<UserInfo>(userKey, userInfo);
    return new Response<UserInfo>(userInfo);
  } else {
  // 신규 사용자
    const userInfo = {
      userName,
      userHash,
      createdAt: (new Date()).toISOString()
    };
    await storage.setItem(userKey, JSON.stringify(userInfo));
    return new Response<UserInfo>(userInfo);
  }
});
