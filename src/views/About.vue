<template>
  <div class="about">
    <h1>Schéma général de l'ontologie</h1>
    <v-flex xs12>
      <v-slider v-model="width" :min="Math.min(windowWidth,800)" :max="windowWidth" step="1"></v-slider>

      <v-img :width="width" src="@/assets/ontol.svg" class="my-1" contain></v-img>
    </v-flex>
  </div>
</template>
<script>
export default {
  data() {
    return {
      width: 1000,
      windowWidth: 1200
    };
  },

  mounted() {
    this.windowWidth = window.innerWidth;
    this.width = 0.97 * this.windowWidth;
    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.windowWidth = window.innerWidth;
      });
    });
  }
};
</script>
