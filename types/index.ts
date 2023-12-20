interface WidgetContent {
    title: string;
}

export type WidgetType = 'A' | 'B' | 'C' | 'D';

export interface IWidget<T> {
    uuid: string;
    type: WidgetType;
    sizeX: string;
    sizeY: string;
    posX: string;
    posY: string;
    content: T & WidgetContent
}

export interface ContentTypeA extends WidgetContent {
    maintext: string;
    caption: string;
    imagesrc: string;
}

export interface ITab {
    id: string;
    title: string;
    prepend?: string;
    append?: string;
    widgets: IWidget<unknown>[]
}
