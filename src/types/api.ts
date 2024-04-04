import type { Tab } from './tab';
import type { UserInfo } from './user';

interface ErrorObject extends Error {
    errorCode: string;
    message: string;
    stack?: Error['stack'];
    cause?: Error['cause'];
}

interface Response<BodyType> {
    body: BodyType | null;
    statusCode: number;
    statusMessage: string;
    error?: ErrorObject;
}
export namespace API {
    export interface SignInResponse extends Response<UserInfo> {}
    export interface DashboardDetailResponse extends Response<Tab.Item> {}
    export interface DashboardListResponse extends Response<Tab.Item[]> {}
}
