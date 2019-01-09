<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-img src="@/assets/logo.png" class="my-1" contain height="150"></v-img>
      </v-flex>
      <v-flex xs12>
        <v-btn color="#003049" class="white--text">Requête 1</v-btn>
        <v-btn color="#003049" class="white--text">Requête 2</v-btn>
        <v-btn color="#003049" class="white--text">Requête 3</v-btn>
        <v-btn color="#003049" class="white--text">Requête 4</v-btn>
        <v-btn color="#003049" class="white--text">Requête 5</v-btn>
      </v-flex>
      <v-flex xs12>
        <v-form>
          <v-textarea solo auto-grow v-model="query" :loading="load"></v-textarea>
          <v-btn color="#053C5E" class="white--text" large @click="sender" @keyup.ctrl.76="sender">Envoyer</v-btn>
        </v-form>
      </v-flex>

      <v-flex xs12>
        <br>
        <br>
        <h2>Réponse</h2>
        <v-data-table :headers="headers" :items="tuples" class="elevation-1">
          <template slot="no-data">
            <v-alert
              :value="emptyResp"
              color="error"
              icon="warning"
            >Sorry, nothing to display here :(</v-alert>
          </template>
          <template slot="items" slot-scope="props">
            <td v-for="attr in result.head.vars" :key="attr">{{ props.item[attr] }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    query: "",
    result: "",
    headers: [],
    tuples: [],
    load: false,
    emptyResp: false,
    altQueries: [],
  }),
  methods: {
    async sender() {
      this.load = true;
      let urlQuery =
        "http://localhost:3030/companies?query=" +
        encodeURIComponent(this.query);
      let response = await fetch(urlQuery);
      this.result = await response.json();
      this.headers = this.result.head.vars.map(str => {
        return { text: str, value: str };
      });
      this.tuples = this.result.results.bindings.map(b => {
        return Object.assign.apply(
          { value: false },
          Object.keys(b).map(v => ({ [v]: b[v]["value"] }))
        );
      });
      this.load = false;
      this.emptyResp = !this.result.results.bindings.length;
    }
  },
  mounted() {
    this.query = `PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\nPREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\nPREFIX owl: <http://www.w3.org/2002/07/owl#>\nPREFIX xsd: <http://www.w3.org/2001/XMLSchema#>\nprefix : <http://www.semanticweb.org/jilb/ontologies/2018/11/compagnies#>
\nSELECT ?subject ?predicate ?object\nWHERE {
    ?subject ?predicate ?object\n}`;

     window.addEventListener("keypress", e => {
      console.log(String.fromCharCode(e.keyCode));
    });
  }
};
</script>

<style>
</style>
