// require lib
import Vue from 'vue'
import VueCodemirror from 'vue-codemirror'

import 'codemirror/mode/sparql/sparql.js'



// require active-line.js
import 'codemirror/addon/selection/active-line.js'
// styleSelectedText
import 'codemirror/addon/selection/mark-selection.js'
import 'codemirror/addon/search/searchcursor.js'

import 'codemirror/addon/edit/matchbrackets'
import 'codemirror/addon/edit/closebrackets'

// highlightSelectionMatches
import 'codemirror/addon/scroll/annotatescrollbar.js'
import 'codemirror/addon/search/matchesonscrollbar.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/search/match-highlighter.js'


// keyMap
import 'codemirror/mode/clike/clike.js'
import 'codemirror/addon/comment/comment.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'
import 'codemirror/addon/search/search.js'
import 'codemirror/keymap/sublime'

// require styles
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/pastel-on-dark.css'


// require more codemirror resource...

// you can set default global options and events when use
Vue.use(VueCodemirror, {
    options: {
        tabSize: 4,
        mode: "application/sparql-query",
        theme: "pastel-on-dark",
        styleActiveLine: true,
        lineNumbers: true,
        matchBrackets: true,
        autoCloseBrackets: true,
        line: true,
        keyMap: "sublime",
        highlightSelectionMatches: {
            showToken: /\w/,
            annotateScrollbar: true
        },
        extraKeys: { "Ctrl": "autocomplete" },
        hintOptions:{
          completeSingle: false
        }
    },

    //   events: ['scroll', ...]
})