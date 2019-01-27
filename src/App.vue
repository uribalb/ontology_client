<template>
  <v-app  class="white">
    <v-toolbar>
      <v-toolbar-title class="headline text-uppercase">
        <span>Business</span>
        &nbsp;
        <span class="font-weight-light">ONTOLOGY</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
        <span class="mr-2">
          <router-link to="/">Home</router-link>
        </span>
        <span class="mr-2">
          <router-link to="/about">About</router-link>
        </span>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'App',

  data () {
    return {
      //
    }
  }
}
</script>
