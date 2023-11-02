export interface ITab {
    id: string;
    title: string;
    prepend?: string;
    append?: string;
    widgets: Widget<unknown>[]
}

interface WidgetContent {
    title: string;
}

type WidgetType = 'A' | 'B';

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