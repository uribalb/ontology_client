<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>
        <v-img src="@/assets/logo.png" class="my-1" contain height="150"></v-img>
      </v-flex>
      <v-flex xs12>
        <v-menu
          open-on-hover
          bottom
          offset-y
          transition="scale-transition"
          max-width="200px"
          v-for="(elm, index) in altQueries"
          :key="index"
        >
          <v-sheet class="pa-3" color="#302C2B">
            <h3 class="amber--text lighten-1">{{elm.title}}</h3>
            <p class="white--text">{{elm.description}}</p>
          </v-sheet>
          <v-btn
            slot="activator"
            color="#003049"
            class="white--text"
            @click="query=elm.query"
          >{{elm.title}}</v-btn>
        </v-menu>
      </v-flex>
      <v-flex xs12>
        <v-progress-linear class="ma-0" :indeterminate="load"></v-progress-linear>
        <v-form>
          <codemirror v-model="queryTrim"></codemirror>
          <v-btn
            color="#053C5E"
            class="white--text"
            large
            @click="sender"
            @keyup.ctrl.76="sender"
          >Excécuter</v-btn>
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
    altQueries: []
  }),
  computed: {
    queryTrim:{
      // getter
      get: function () {
      return this.query.trim();
      },
      // setter
      set: function (newValue) {
        this.query = newValue
      }
    }
  },
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
    const queryHeader = `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX cd: <http://citydata.wu.ac.at/ns#>
PREFIX : <http://www.semanticweb.org/jilb/ontologies/2018/11/compagnies#>
    `;

    this.altQueries = [
      {
        title: "Tous tuples",
        description: `Requête basique: retourne l'ensemble des tuples 
                     RDF de l'ontologie`,
        query: `
${queryHeader}
SELECT ?subject ?predicate ?object
WHERE {
  ?subject ?predicate ?object
}
  `
      },
      {
        title: "Géants d'industrie",
        description: `
      Retourne les compagnies dont le revenu  (ou capital)
      est supérieur au revenu moyen (ou capital moyen) de 
      leurs industries respectives
      `,
        query: `
${queryHeader}
select ?x ?r ?c ?z ?avgR ?avgC ?count where {
  ?x :operating_in ?z.
  ?x :revenue ?r.
  ?x :capital ?c.
filter(?r >= ?avgR || ?c >= ?avgC)

  {
  select ?z (avg(?y) as ?avgR) (avg(?w) as ?avgC) (count(?s) as ?count) where {
    ?s :revenue ?y.
    ?s :capital ?w.
    ?s :operating_in ?z
  } GROUP BY ?z
    }
}
    `
      }
    ];
    this.query = this.altQueries[0].query;
  }
};
</script>

<style>
.CodeMirror {
  text-align: left !important;
}
.CodeMirror-focused .cm-matchhighlight {
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQI12NgYGBgkKzc8x9CMDAwAAAmhwSbidEoSQAAAABJRU5ErkJggg==);
  background-position: bottom;
  background-repeat: repeat-x;
}
.cm-matchhighlight {
  background-color: rgba(146, 181, 255, 0.205);
}
.CodeMirror-selection-highlight-scrollbar {
  background-color: green;
}
</style>
