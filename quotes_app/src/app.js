//  Filter filtering quotes 
// table of quotes
// footer pagination for quotes

const Quotes = {
  data(){
    return {
      quotes: this.list
    }
  },
  props: ['list', 'btn', 'loading'],
  methods: {
    fetchData: () => console.log(list)
  },
  template: `
    <div @click="fetchData">
      <h1>Foobar</h1>
      <span v-for="ele in quotes">
        <h2>Hello</h2>
      </span>
    </div>
  `
}


// "<button @click=\"fetchData\">{{btn}}</button>" 



const Quote = {
  data(){
    return {}
  },
  methods: {},
  template: ""
}

const Filter = {
  data(){
    return {}
  },
  methods: {},
  template: ""
}

const Pagination = {
  data(){
    return {}
  },
  methods: {},
  template: ""
}

const app = new Vue({
  el: '#app',
  data(){
    return{
      placeholder: "BenchPrep JavaScript Exercise",
      btn: "Moving",
      loading: false,
      list: []
    }
  },
  components: {
    Filter, Pagination, Quotes
  },
  created: async () => {
    loading = true
    const url = "https://gist.githubusercontent.com/benchprep/dffc3bffa9704626aa8832a3b4de5b27/raw/quotes.json"
    const response = await fetch(url);
    const data = await response.json();
    this.list = data;
    loading = false
  },
  // methods: {
  //   filter and sorting,
  //   pagination
  // },
})
