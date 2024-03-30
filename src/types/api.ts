import type { Tab } from './tab';

export namespace API {
    export interface DashboardDetailResponse {
        data: {
            value: Tab.Item
        }
    }
}
