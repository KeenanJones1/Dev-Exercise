//  Filter filtering quotes 
// table of quotes
// footer pagination for quot≥÷es

const Quote = {
  props: ['quote'],
  data(){
    return {}
  },
  methods: {},
  template: `
      <tr>
        <td>{{quote.theme}}</td>
        <td>{{quote.context}}</td>
        <td>{{quote.quote}}</td>
        <td>{{quote.source}}</td>
      </tr>
  `
}


const Quotes = {
  props: ['quotes', 'btn', 'loading', 'current'],
  components: {Quote},
  template: `
    <table>
      <tr>
        <th>Theme</th>
        <th>Context</th>
        <th>Quote</th>
        <th>Source</th>
      </tr>
      <Quote v-for="ele in current" :quote='ele'/>
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
    <ul>
      <li v-for="ele in themes">
        <input type=checkbox @change="filter(ele, $event)">  
          {{ele}}
        </input>
      </li>
    </ul>
  `
}

const Pagination = {
  props: ['current', 'paginate', 'pages'],
  data(){
    return {
      pageNums:[]
    }
  },

  template: `
    <ul>
      <li v-for="page in pages" @click="paginate(page)">
        <button>{{page}}</button>
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
    <div>
      <h1>{{query}}</h1>
      <input v-model="query" @input="seek($event)"/>
      <button @click="submit">Submit</button>
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
      selectedTheme: [],
      query: "",
  },
  components: {
    Sorting, Pagination, Quotes, Search
  },
  created: async function () {
    this.loading = true
    const url = "https://gist.githubusercontent.com/benchprep/dffc3bffa9704626aa8832a3b4de5b27/raw/quotes.json"
    const response = await fetch(url);
    const data = await response.json();
    this.quotes = data;
    this.loading = false
    // pagination begin ====================
    const indexOfLastPost = this.currentPage * this.perPage;
    const indexOfFirstPost = indexOfLastPost - this.perPage;
    const currentQuotes = data.slice(indexOfFirstPost, indexOfLastPost)
    this.currentQuotes = currentQuotes
    
    for(let i = 1; i <= Math.ceil(this.quotes.length / this.perPage); i++){
      this.pages.push(i)
    }
    // pagination ends===================

    // filtering begin=====================
      data.map(ele => {
        if(!this.themes.includes(ele.theme)){
          this.themes.push(ele.theme)
        }
      })
    // filtering ends======================
  },
  methods: {
    //  searching
    filterQuotes: function(theme){
      this.selectedTheme = [...this.selectedTheme, theme]

      this.filtered = this.quotes.filter(ele => this.selectedTheme.includes(ele.theme))

      const indexOfLastPost = this.currentPage * this.perPage;
      const indexOfFirstPost = indexOfLastPost - this.perPage;
      const currentQuotes = this.filtered.slice(indexOfFirstPost, indexOfLastPost)
      this.currentQuotes = currentQuotes

      this.pages = []
      for(let i = 1; i <= Math.ceil(this.filtered.length / this.perPage); i++){
        this.pages.push(i)
      }
      if (this.pages.length < 2) this.pages = []
    },

    unFilterQuotes: function(theme) {
      ele = this.selectedTheme.find(ele => ele == theme)
      idx = this.selectedTheme.indexOf(ele)

      this.selectedTheme.splice(idx, 1)

      if(this.filtered.length > 1){
        this.filtered = this.quotes
      }else{
        this.filtered = this.quotes.filter(ele => this.selectedTheme.includes(ele.theme))
      }

      const indexOfLastPost = this.currentPage * this.perPage;
      const indexOfFirstPost = indexOfLastPost - this.perPage;
      const currentQuotes = this.filtered.slice(indexOfFirstPost, indexOfLastPost)
      this.currentQuotes = currentQuotes

      this.pages = []
      for(let i = 1; i <= Math.ceil(this.filtered.length / this.perPage); i++){
        this.pages.push(i)
      }
      if (this.pages.length < 2) this.pages = []
    },

    filter: function(theme, event){
      if(event.target.checked){
        this.filterQuotes(theme)
      }else{
        this.unFilterQuotes(theme)
      }
    },

    paginate: function(page){
      this.currentPage = page
      const indexOfLastPost = this.currentPage * this.perPage;
      const indexOfFirstPost = indexOfLastPost - this.perPage;
      if(this.filtered.length < 1){
        const currentQuotes = this.quotes.slice(indexOfFirstPost, indexOfLastPost)
        this.currentQuotes = currentQuotes
      }else{
        const currentQuotes = this.filtered.slice(indexOfFirstPost, indexOfLastPost)
        this.currentQuotes = currentQuotes
      }
    },
    seek: function(e){
      this.query = e.target.value
    },
    onSubmit: function(){

      let check = this.quotes.filter(ele => {
        return ele.quote.toLowerCase().includes(this.query.toLowerCase())
      })

      if(this.query == ''){
        check = this.quotes 
        const indexOfLastPost = this.currentPage * this.perPage;
        const indexOfFirstPost = indexOfLastPost - this.perPage;
        const currentQuotes = check.slice(indexOfFirstPost, indexOfLastPost)
        this.currentQuotes = currentQuotes

        this.pages = []
        for(let i = 1; i <= Math.ceil(this.quotes.length / this.perPage); i++){
        this.pages.push(i)
        }

        if (this.pages.length < 2) this.pages = []
      }else{
              const indexOfLastPost = this.currentPage * this.perPage;
              const indexOfFirstPost = indexOfLastPost - this.perPage;
              const currentQuotes = check.slice(indexOfFirstPost, indexOfLastPost)
              this.currentQuotes = currentQuotes
        
              this.pages = []
              for(let i = 1; i <= Math.ceil(this.filtered.length / this.perPage); i++){
                this.pages.push(i)
              }
              if (this.pages.length < 2) this.pages = []
      }
    },



  },
})
