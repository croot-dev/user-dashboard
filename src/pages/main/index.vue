<template>
  <div class="wrapper">
    <TabContainer />
  </div>
</template>
<script setup lang="ts">
import TabContainer from '~/components/Main/Tab/Container.vue';

definePageMeta({
  middleware: 'auth'
});
</script>
  <style lang="scss" scoped>
  :global(body) {
    margin: 0;
  }

  .wrapper {
    overflow: hidden;
    position: relative;
    width: 100vw;
    height: 100vh;
    margin: 0;
    background-color: #f1f1f1;
    display: flex;
    flex-direction: column;
  }
</style>
