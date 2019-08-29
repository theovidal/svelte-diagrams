<script>
  import { PieChart } from 'svelte-diagrams'
  import 'svelte-diagrams/dist/svelte-diagrams.css'

  let data = [63.37, 15.05, 4.49, 3.75, 3.57, 2.58]
  let legends = [
    {
      title: 'Chrome',
      color: '#ffc107',
    },
    {
      title: 'Safari',
      color: '#29b6f6',
    },
    {
      title: 'Firefox',
      color: '#ff5722',
    },
    {
      title: 'Samsung Internet',
      color: '#ab47bc',
    },
    {
      title: 'UC Browser',
      color: '#fff176',
    },
    {
      title: 'Opera',
      color: '#d32f2f',
    },
  ]
</script>

<h1>Svelte diagrams</h1>

<h2>Browser usage</h2>

<PieChart {data} {legends}/>