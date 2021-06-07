<template>
  <div class="empty-area">
    <lottie-player
      src="assets/empty-state.json"
      background="transperant"
      speed="1"
      style="width: 200px; height: 100px"
      loop
      autoplay
    ></lottie-player>
    <span>No task found!!!</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component
export default class Emtpy extends Vue {}
</script>

<style lang="scss">
.empty-area {
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>