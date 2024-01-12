import type { Widget } from './';

export namespace Tab {
    export interface globalSetting {
        startDate: string;
        endDate: string;
        autoReload: boolean;
    }

    export interface Item<T = unknown> {
        id: string;
        title: string;
        globalSetting: globalSetting
        widgets: Widget.Item<T>[]
    }
}
