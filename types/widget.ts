import { WIDGET_TYPE } from '~/constants';
export namespace Widget {
    export type Id = string;

    export interface Setting {
        startDate: string;
        endDate: string;
    }
    export interface Content {
        title: string;
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

    export interface ContentA extends Content {
        maintext: string;
        caption?: string;
        imagesrc?: string;
    }

}
