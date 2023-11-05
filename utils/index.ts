import WidgetContentTypeA from "~/components/WidgetContent/WidgetContentTypeA.vue"
import WidgetContentTypeB from "~/components/WidgetContent/WidgetContentTypeB.vue"
import WidgetContentTypeC from "~/components/WidgetContent/WidgetContentTypeC.vue"
import WidgetContentTypeD from "~/components/WidgetContent/WidgetContentTypeD.vue"
export const componentMap = new Map([
    ['A', WidgetContentTypeA],
    ['B', WidgetContentTypeB],
    ['C', WidgetContentTypeC],
    ['D', WidgetContentTypeD],
])


export const toSnakeCase = (str) => {
    return str.replace(/ /g,'_').replace(/([A-Z])/g, ($1) => ("_"+$1.toLowerCase()));
   };