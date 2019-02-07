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
            @click="query=queryHeader + elm.query"
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
    altQueries: [],
    queryHeader: `
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX owl: <http://www.w3.org/2002/07/owl#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX cd: <http://citydata.wu.ac.at/ns#>
PREFIX : <http://www.semanticweb.org/jilb/ontologies/2018/11/companies#>
    `
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
  
    this.altQueries = [
      {
        title: "Partenaires du secteur publique",
        description: `Requête basique: retourne toutes les organisations
                      ayant collaboré avec des états sur des projets 
                     ainsi que les états et projets concernés.`,
        query: `
SELECT ?etat  ?project ?partenaire
WHERE {
  ?etat a :State.
  ?etat :stakeholder_in ?project.
  ?partenaire :stakeholder_in ?project.
}
  `
      },
      {
        title: "Géants d'industrie",
        description: `
      Retourne les compagnies dont le revenu  (ou capital)
      est supérieur au revenu moyen (ou capital moyen) de 
      leurs industries respectives.
      `,
        query: `
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
      },
      {
        title: 'Secteur Dominant',
        description:`Retourne le secteur ayant le plus de compagnies
                    ainsi que les compagnies qui s'y trouvent.
                    `,
        query:`
SELECT distinct ?sector  ?company WHERE { 
  { 
    SELECT ?sector (count(?company) as ?count) WHERE { 
      ?sector :sector_of ?company . 
    } GROUP BY ?sector 
   }filter(?count = ?maxCount)
   {
     SELECT (max(?number_of_companies) AS ?maxCount) WHERE {
       {
          SELECT ?sector (COUNT(?company) as ?number_of_companies) WHERE { 
          	?sector :sector_of ?company . 
          } GROUP BY ?sector 
      	} 
      } 
    }
   {
     SELECT * WHERE {
          ?company :operating_in ?sector . 
      }
    }
}
        `
      },
      {
        title: "Compagnies clés par ville",
        description: `
        Retourne, pour chaque ville, 
        la compagnie ayant le capital maximal 
        parmi les compagnies dont le quartier général
        se trouve dans la ville en question.
        `,
        query: `
select ?x ?r ?z ?maxC where {
  ?x :headquarters ?z.
  ?x :capital ?r.
filter(?r = ?maxC)
  {
  select ?z (max(?y) as ?maxC) where {
    ?s :capital ?y.
    ?s :headquarters ?z
  } GROUP BY ?z
    }
}
        `
      },
      {
        title:"Secteurs mixtes fortement privatisés",
        description: `
        Retourne, parmi tous les secteurs comportant des compagnies publiques,
        ceux dans lesquels il y au moins tois fois plus de compagnies privées
        que de compagnies publiques.
        `,
        query: `
SELECT ?sector  ?numPriv ?numPub
WHERE {
    {
      select ?sector (count(?comp) as ?numPub) where {
          ?sector :sector_of ?comp.
          ?etat a :State.
          ?sh :shareholder_in ?etat.
          ?sh :shareholder_out ?comp.
          ?sh :sharePercent ?p
          filter(?p >= 50)
      }group by ?sector
    }
      {
      select ?sector (count(?comp) as ?numPriv) where {
			{
              ?sector :sector_of ?comp.
            }
            minus
            {
              ?sector :sector_of ?comp.
              ?etat a :State.
              ?sh :shareholder_in ?etat.
              ?sh :shareholder_out ?comp.
              ?sh :sharePercent ?p
              filter(?p >= 50)
            }
      }group by ?sector
    }
  filter( 3 * ?numPub <= ?numPriv)
}
        `
      }
    ];
    this.query = this.queryHeader + this.altQueries[0].query;
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
