<script lang="ts">
  import { Chart } from "flowbite-svelte";

  export let xAxis = [];
  export let yAxis = [];
  export let yAxis2 = [];
  let options;

  $: options = {
  chart: {
    type: 'area',
    height: '350px',
    width: '100%',
    fontFamily: 'Inter, sans-serif',
    toolbar: {
      show: false
    }
  },
  tooltip: {
    enabled: true,
    shared: true, // Beide Linien im selben Tooltip
    intersect: false,
    x: {
      show: true
    }
  },
  fill: {
    type: 'gradient',
    gradient: {
      opacityFrom: 0.55,
      opacityTo: 0
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 2,
    curve: 'smooth' // Glättet die Linien
  },
  grid: {
    show: true,
    strokeDashArray: 4,
    padding: {
      left: 2,
      right: 2,
      top: 0
    }
  },
  series: [
    {
      name: 'Correct Answers',
      data: yAxis, // Korrekt beantwortete Fragen
      color: '#1A56DB'
    },
    {
      name: 'Total Questions',
      data: yAxis2, // Gesamtanzahl der Fragen
      color: '#FF5733'
    }
  ],
  xaxis: {
    categories: xAxis,
    labels: {
      show: true
    },
    axisBorder: {
      show: true
    },
    axisTicks: {
      show: true
    }
  },
  yaxis: {
    labels: {
      show: false
    },
    axisBorder: {
      show: false
    },
    axisTicks: {
      show: false
    }
  }
};

</script>

<div class="w-full h-max">
  <Chart {options} />
</div>