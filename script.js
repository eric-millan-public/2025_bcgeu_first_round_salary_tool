const valueSelector = document.getElementById('valueSelector');
const equationDisplay = document.getElementById('equationDisplay');
const ctx = document.getElementById('myChart').getContext('2d');

function computeResult(value) {
  return 1 + value;
}

function updateEquationDisplay(value) {
  const result = computeResult(value);
  equationDisplay.textContent = `Equation: 1 + ${value} = ${result}`;
}

// Initial chart setup
let chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Result'],
    datasets: [{
      label: '1 + Selected Value',
      data: [computeResult(parseInt(valueSelector.value))],
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Value'
        }
      }
    }
  }
});

// Handle dropdown change
valueSelector.addEventListener('change', () => {
  const val = parseInt(valueSelector.value);
  const result = computeResult(val);

  updateEquationDisplay(val);
  chart.data.datasets[0].data = [result];
  chart.update();
});

// Set initial state
updateEquationDisplay(parseInt(valueSelector.value));
