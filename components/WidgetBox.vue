<template>
  <v-card class="widget-box">
    <v-card-item>
      <slot></slot>
    </v-card-item>

    <v-card-actions>
      <div class="widget-option">
        <ul>
          <WidgetOptionEdit />
          <WidgetOptionRemove />
        </ul>
      </div>
    </v-card-actions>
  </v-card>
</template>
<script setup lang="ts">
import WidgetOptions from "./WidgetOptions.vue";

</script>

<style lang="scss" scoped>
.widget-box {
  height: 100%;
  &:hover .widget-option {
    opacity: 1;
  }

  .widget-option {
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0;

    ul {
      display: flex;
      flex-direction: row;
      list-style: none;
    }
    li {
      
    }
  }

}
</style>