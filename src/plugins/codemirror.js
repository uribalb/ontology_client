// require lib
import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'
import 'codemirror/mode/sparql/sparql.js'
import 'codemirror/theme/base16-dark.css'



// require active-line.js
import 'codemirror/addon/selection/active-line.js'
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/match-highlighter.js'

// require styles
import 'codemirror/lib/codemirror.css'

// require more codemirror resource...

// you can set default global options and events when use
Vue.use(VueCodemirror, {
    options: {
        tabSize: 4,
        mode: "application/sparql-query",
        theme: "base16-dark",
        styleActiveLine: true,
        lineNumbers: true,
        line: true,
        highlightSelectionMatches: {
            showToken: /\w/,
            annotateScrollbar: true
        },
    },

    //   events: ['scroll', ...]
})