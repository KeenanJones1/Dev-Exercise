
const Modal = {
  props: {
    open: Boolean,
    quote: Object,
    close: Function,
  },
  template: `
    <div v-if="open" class="overlay">
      <div class="exit-btn">
        <button @click="close">X</button>
      </div>
      <div class="quote-details">
        <div class="quote-info">
          <h3>Theme:<span>{{quote.theme}}</span></h3>
          <h3>Title:<span>{{quote.context}}</span></h3>
          <h3>Source:<span>{{quote.source}}</span></h3>
        </div>
        <div class="quote-text">
          <h6>Quote:</h6>
          <p>{{quote.quote}}</p>
        </div>
      </div>
    </div>
  `
}

const Quote = {
  props: {
    quote: Object,
    modal: Function 
  },
  template: `
      <tr class="quote-row" @click="modal(quote)">
        <td class="quote" id="quote-theme">{{quote.theme}}</td>
        <td id="quote-context">{{quote.context}}</td>
        <td id="quote-text">{{quote.quote}}</td>
        <td id="quote-source">{{quote.source}}</td>
      </tr>
  `
}


const Quotes = {
  props: {
    quotes: Array,
    loading: Boolean,
    current: Array,
    modal: Boolean
  },
  components: {Quote},
  template: `
    <table id="quote-table">
      <thead>
        <tr class="table-headers">
          <th><p>Theme</p></th>
          <th><p>Title</p></th>
          <th><p>Quote</p></th>
          <th><p>Source</p></th>
        </tr>
      </thead>
      <tbody>
        <Quote v-for="ele in current" :quote='ele' :key="ele.source" :modal="modal"/>
      </tbody>
    </table>
  `
}

const Filtering = {
  props: {
    themes: Array,
    filter: Function
  },
  template: `
    <ul id="theme-container">
      <li class="theme" v-for="ele in themes">
        <input type=checkbox @change="filter(ele, $event)">  
          {{ele}}
        </input>
      </li>
    </ul>
  `
}

const Pagination = {
  props: {
    paginate: Function,
    current: Number,
    pages: Array
  },
  template: `
    <ul id="pages">
      <li v-for="page in pages" @click="paginate(page)">
        <button v-bind:class="{active: current == page ? true : false}" id="page">{{page}}</button>
      </li>
    </ul>
  `
}


const Search = {
  props: {
    seek: Function,
    submit: Function
  },
  data:function(){
    return{
      query: ""
    }
  },
  template: `
    <div class="search-container">
      <input id="search-bar" v-model="query" @input="seek($event)"/>
      <button @click="submit" id="submit-btn">Submit</button>
    </div>
  `
}

const app = new Vue({
  el: '#app',
  data:{
      placeholder: "BenchPrep JavaScript Exercise",
      loading: false,
      quotes: [],
      currentPage: 1,
      perPage: 15,
      pages: [],
      currentQuotes: [],
      themes:[],
      filtered: [],
      selectedThemes: [],
      query: "",
      modalOpen: false,
      modalQuote: {},
  },
  components: {
    Filtering, Pagination, Quotes, Search, Modal
  },
  methods: {
    showModal: function(quote){
      this.modalOpen = true
      this.modalQuote = quote
    },

    closeModal: function(){
      this.modalOpen = false
      this.modalQuote = {}
    },

    quoteResults: function(quotes, query){
      return quotes.filter(ele => {
        ele.quote.toLowerCase().includes(query.toLowerCase)
      })
    },

    updateThemes:function(themes, theme, checked=true){
      if(checked){
        const newThemes = [...themes, theme]
        return newThemes
      }else{
        const idx = themes.indexOf(theme)
        themes.splice(idx, 1)
        return themes
      }
    },

    updateQuotes: function(quotes, themes, checked=true){
      if(themes.length == 0 && !checked){
        return quotes
      }
      else{
        const filteredQoutes = quotes.filter(ele => themes.includes(ele.theme))
        return filteredQoutes
      }
    },

    updateShowingQuotes:function(quotes, currentPage, perPage){
      const indexOfLastPost = currentPage * perPage;
      const indexOfFirstPost = indexOfLastPost - perPage;
      return [...quotes].slice(indexOfFirstPost, indexOfLastPost)
    },

    updatePages:function(perPage, quotes){
      let pages = []
      for(let i = 1; i <= Math.ceil(quotes.length / perPage); i++){
        pages.push(i)
      }

      if (pages.length < 2) pages = [1]
      return pages
    },

    filter: function(theme, event){
      this.currentPage = 1
      const updatedThemes = this.updateThemes(this.selectedThemes, theme, event.target.checked)
      this.selectedThemes = updatedThemes
      const updatedQuotes  = this.updateQuotes(this.quotes, updatedThemes, event.target.checked)
      const updatedQuotesShowing = this.updateShowingQuotes(updatedQuotes, this.currentPage, this.perPage)
      const updatedPageList = this.updatePages(this.perPage, updatedQuotes)

      if(updatedPageList.length < 2){
        this.pages = [1]
      }else{
        this.pages = updatedPageList
      }

      this.currentQuotes = updatedQuotesShowing
      this.filtered = updatedQuotes
      this.selectedThemes = updatedThemes
    },

    paginate: function(page){
      this.currentPage = page
      if(this.filtered.length < 1){
        this.currentQuotes = this.updateShowingQuotes(this.quotes, this.currentPage, this.perPage)
      }else{
        this.currentQuotes = this.updateShowingQuotes(this.filtered, this.currentPage, this.perPage)
      }
    },

    seek: function(e){
      this.query = e.target.value
      this.onSubmit()
    },

    onSubmit: function(){
      let matchingQuotes = this.quotes.filter(ele => {
        return ele.quote.toLowerCase().includes(this.query.toLowerCase())
      });

      if(this.filtered.length){
        matchingQuotes = this.filtered.filter(ele => {
          return ele.quote.toLowerCase().includes(this.query.toLowerCase())
        });
      };

      if(this.query == ''){
        this.currentQuotes = this.updateShowingQuotes(this.quotes, this.currentPage, this.perPage)
        this.pages = this.updatePages(this.perPage, this.quotes)
      }else{
        this.currentQuotes = this.updateShowingQuotes(matchingQuotes, this.currentPage, this.perPage)
        this.pages = this.updatePages(this.perPage, matchingQuotes)
      }
    },
},

  created: async function () {
    this.loading = true;
    let url, response, data
    try{
       url = "https://gist.githubusercontent.com/benchprep/dffc3bffa9704626aa8832a3b4de5b27/raw/quotes.json";
       response = await fetch(url);
       data = await response.json();
    }
    catch(err){
      console.log(err)
    }

    this.quotes = data;
    this.currentQuotes = this.updateShowingQuotes(this.quotes, this.currentPage, this.perPage);
    this.pages = this.updatePages(this.perPage, this.quotes);


    data.map(ele => {
      if(!this.themes.includes(ele.theme)){
        this.themes.push(ele.theme)
      }
    });

    this.loading = false;
  },
})