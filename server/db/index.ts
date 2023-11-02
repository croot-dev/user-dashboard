export const db = {
    dashboard: [
        {
            id: "1", title: "Title1", prepend: "icon",
            widgets: [
                {
                    uuid: "1", type: "B", sizeX: "2", sizeY: "1", posX: "0", posY: "0",
                    content: {
                        title: "개발진행상황",
                        maintext: "25%",
                        caption: "completed",
                        imagesrc: "",
                    },
                },
                {
                    uuid: "2", type: "A", sizeX: "1", sizeY: "1", posX: "2", posY: "0",
                    content: {
                        title: "위젯2번",
                        maintext: "25%",
                    },
                },
                {
                uuid: "3", type: "C", sizeX: "1", sizeY: "1", posX: "3", posY: "0",
                content: { title: "위젯3번", maintext: "25%" },
                },
                {
                uuid: "4", type: "D", sizeX: "2", sizeY: "2", posX: "2", posY: "1",
                content: { title: "위젯4번", maintext: "25%" },
                },
                {
                uuid: "5", type: "E", sizeX: "1", sizeY: "1", posX: "0", posY: "1",
                content: { title: "위젯5번", maintext: "25%" },
                },
                {
                uuid: "6", type: "A", sizeX: "1", sizeY: "2", posX: "1", posY: "1",
                content: { title: "위젯6번", maintext: "25%" },
                },
                {
                uuid: "7", type: "A", sizeX: "1", sizeY: "1", posX: "0", posY: "1",
                content: { title: "위젯7번", maintext: "25%" },
                },
            ]
        },
        { id: "2", title: "Title2", prepend: "" },
        { id: "3", title: "Title1", prepend: "icon" },
        { id: "4", title: "Title2", prepend: "" },
        { id: "5", title: "Title1", prepend: "icon" },
        { id: "6", title: "Title2", prepend: "" },
        { id: "7", title: "Title1", prepend: "icon" },
        { id: "8", title: "Title2", prepend: "" },
    ]
}