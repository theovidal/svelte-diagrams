<script>
  import { PieChart } from 'svelte-diagrams'
  import 'svelte-diagrams/dist/svelte-diagrams.css'

  let data = [8, 9, 2, 12]
  let legends = [
    {
      title: 'Safari',
      color: 'blue'
    },
    {
      title: 'Firefox',
      color: 'orange'
    },
    {
      title: 'Edge',
      color: 'lightblue'
    },{
      title: 'Chrome',
      color: 'red'
    },

  ]
</script>

<h1>Svelte diagrams</h1>

<PieChart {data} {legends}/>