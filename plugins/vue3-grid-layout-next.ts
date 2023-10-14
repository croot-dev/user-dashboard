import { GridLayout, GridItem } from "vue3-grid-layout-next"

export default defineNuxtPlugin((app) => {
    app.vueApp.component('GridLayout', GridLayout)
    app.vueApp.component('GridItem', GridItem)
})
