import type { Widget } from './';

export namespace Tab {
    export type Id = string;
    export interface globalSetting {
        startDate: string;
        endDate: string;
        autoReload: boolean;
    }

    export interface Item {
        id: string;
        title: string;
        globalSetting: globalSetting
        widgets: Widget.Item[]
    }
}
