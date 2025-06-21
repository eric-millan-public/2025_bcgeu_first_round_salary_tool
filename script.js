const ctx = document.getElementById('myChart').getContext('2d');
const valueSelector = document.getElementById('valueSelector');

// Initial chart setup
let chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Result'],
    datasets: [{
      label: '1 + Selected Value',
      data: [1 + parseInt(valueSelector.value)],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

// Update chart on selection change
valueSelector.addEventListener('change', () => {
  const selectedValue = parseInt(valueSelector.value);
  chart.data.datasets[0].data = [1 + selectedValue];
  chart.update();
});
