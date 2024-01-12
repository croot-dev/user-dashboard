export namespace Widget {
    export type Key = string;

    export interface Setting {
        startDate: string;
        endDate: string;
    }
    export interface Content {
        title: string;
    }

    export type Type = 'A' | 'B' | 'C' | 'D';

    export interface Item<T = unknown> {
        uuid: Key;
        type: Type;
        sizeX: string;
        sizeY: string;
        posX: string;
        posY: string;
        setting?: Setting;
        content: T & Content;
    }

    export interface ContentTypeA extends Content {
        maintext: string;
        caption: string;
        imagesrc: string;
    }

}
