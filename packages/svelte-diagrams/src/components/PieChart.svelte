<script>
  export let data = []
  export let legends = []
  export let size = '150px'
  export let style = ''

  let total = 0
  let step = 0
  style += 'background: conic-gradient('

  data.forEach(function (piece) {
    total += piece
  })
  data.forEach(function(piece, index) {
    style += `${legends[index]['color']} ${step}deg `
    step += (piece/total)*360
    style += `${step}deg,`
  })
  style = style.slice(0, -1) + ');'

  style += `width: ${size}; height: ${size};`
</script>

<style>
  .diagram.pie-chart {
    border-radius: 50%;
  }
</style>

<div class="diagram pie-chart" {style}>

</div>