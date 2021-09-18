
const Quote = {
  props: ['quote', 'modal'],
  data(){
    return {}
  },
  methods: {},
  template: `
      <tr class="quote-row" @click="modal(quote)">
        <td id="quote-theme">{{quote.theme}}</td>
        <td id="quote-context">{{quote.context}}</td>
        <td id="quote-text">{{quote.quote}}</td>
        <td id="quote-source">{{quote.source}}</td>
      </tr>
  `
}


const Quotes = {
  props: ['quotes', 'btn', 'loading', 'current', 'modal'],
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

const Sorting = {
  props: ['themes', 'filter'],
  data(){
    return {}
  },
  methods: {},
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
  props: ['current', 'paginate', 'pages'],
  template: `
    <ul id="pages">
      <li v-for="page in pages" @click="paginate(page)">
        <button class="page">{{page}}</button>
      </li>
    </ul>
  `
}


const Search = {
  props: ['seek', 'submit'],
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
  },
  components: {
    Sorting, Pagination, Quotes, Search,
  },
  methods: {
    
    showModal: function(quote){
      console.log(quote.context)
    },
    quoteResults: function(quotes, query){
      return quotes.filter(ele => {
        ele.quote.toLowerCase().includes(query.toLowerCase)
      })
    },

    updateQuotes: function(quotes, themes){
      return quotes.filter(ele => {
        themes.includes(ele.theme)
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

    updatePages:function(currentPage, perPage, quotes){
      let pages = []
      const indexOfLastPost = currentPage * perPage
      const indexOfFirstPost = indexOfLastPost - perPage
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

      const updatedPageList = this.updatePages(this.currentPage, this.perPage, updatedQuotes)

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
        this.pages = this.updatePages(this.currentPage, this.perPage, this.quotes)

      }else{
        this.currentQuotes = this.updateShowingQuotes(matchingQuotes, this.currentPage, this.perPage)
        this.pages = this.updatePages(this.currentPage, this.perPage, matchingQuotes)
      }
    },
},

  created: async function () {
    this.loading = true;
    const url = "https://gist.githubusercontent.com/benchprep/dffc3bffa9704626aa8832a3b4de5b27/raw/quotes.json";
    const response = await fetch(url);
    const data = await response.json();
    this.quotes = data;
    this.currentQuotes = this.updateShowingQuotes(this.quotes, this.currentPage, this.perPage);
    this.pages = this.updatePages(this.currentPage, this.perPage, this.quotes);

    data.map(ele => {
      if(!this.themes.includes(ele.theme)){
        this.themes.push(ele.theme)
      }
    });

    this.loading = false;
  },
})
