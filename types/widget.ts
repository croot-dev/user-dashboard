import type { LineSeriesOption } from 'echarts';
import { DATA_SOURCE_TYPE, WIDGET_TYPE } from '~/constants';
export namespace Widget {
    export type Id = string;

    export interface Setting {
        startDate: string;
        endDate: string;
    }
    export interface Content {
        title: string;
        dataSource: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE];
    }

    export type Type = typeof WIDGET_TYPE[keyof typeof WIDGET_TYPE]

    export interface Item<T = unknown> {
        id: Id;
        type: Type;
        sizeX: string;
        sizeY: string;
        posX: string;
        posY: string;
        setting?: Setting;
        content: T & Content;
    }

    export interface ContentIndicator extends Content {
        maintext: string;
        caption?: string;
        imagesrc?: string;
    }
    export interface ContentLineChart extends Content {
        dataSource: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE];
        xAxis: string;
        yAxis: string[];
    }

    export interface ContentBarChart extends Content {
        dataSource: typeof DATA_SOURCE_TYPE[keyof typeof DATA_SOURCE_TYPE];
        xAxis: string;
        yAxis: string[];
    }

}
