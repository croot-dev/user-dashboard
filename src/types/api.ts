import type { Tab } from './tab';

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
    export interface DashboardDetailResponse extends Response<Tab.Item> {}
}
