import type { ValueOf } from '.';
import { DATA_SOURCE_TYPE, WIDGET_TYPE, WIDGET_INDICATOR_CALCULATOR } from '../constants';
export namespace Widget {
    export type Id = string;

    export type Type = typeof WIDGET_TYPE[keyof typeof WIDGET_TYPE]

    export interface Setting {
        startDate: string;
        endDate: string;
    }

    export interface Content {
        [WIDGET_TYPE.INDICATOR]: {
            column: string;
            calculator: ValueOf<typeof WIDGET_INDICATOR_CALCULATOR>
        };
        [WIDGET_TYPE.LIST]: {};
        [WIDGET_TYPE.RANK]: {};
        [WIDGET_TYPE.BAR]: {
            xAxis: string;
            yAxis: string[];
        };
        [WIDGET_TYPE.LINE]: {
            xAxis: string;
            yAxis: string[];
        };
        [WIDGET_TYPE.PIE]: {
            name: string;
            value: string;
        }
        [WIDGET_TYPE.SCATTER]: {};
    }
    export interface Item<T = unknown> {
        id: Id;
        sizeX: string;
        sizeY: string;
        posX: string;
        posY: string;
        type: Type;
        title: string;
        dataSourceType: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE];
        setting?: Setting;
        content?: T
    }
}
