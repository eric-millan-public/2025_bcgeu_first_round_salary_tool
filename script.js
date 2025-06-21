// Example wage data – replace this with your actual data
const wageTable = [
  { title: "Admin Officer 14", wage: 32.65 },
  { title: "Technician 3", wage: 28.40 },
  { title: "Research Analyst 2", wage: 35.25 }
];

const positionSelector = document.getElementById('positionSelector');
const initialWageDisplay = document.getElementById('initialWage');
const newWageDisplay = document.getElementById('newWage');
const dollarIncreaseDisplay = document.getElementById('dollarIncrease');
const percentIncreaseDisplay = document.getElementById('percentIncrease');

// Populate dropdown
wageTable.forEach(pos => {
  const option = document.createElement('option');
  option.value = pos.wage;
  option.text = pos.title;
  positionSelector.add(option);
});

// Raise logic
function calculateNewWage(startWage) {
  let wage = startWage;
  wage = wage * 1.005 + 0.15; // Raise 1
  wage = wage * 1.005 + 0.15; // Raise 2
  wage = wage * 1.01;         // Raise 3
  wage = wage * 1.01;         // Raise 4
  return parseFloat(wage.toFixed(2));
}

// Chart setup
const ctx = document.getElementById('myChart').getContext('2d');
let chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Current', 'After 2 Years'],
    datasets: [{
      label: 'Hourly Wage',
      data: [0, 0],
      backgroundColor: ['#aaa', '#4caf50']
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Wage ($/hr)'
        }
      }
    }
  }
});

// Update chart and numbers
function updateDisplay() {
  const startWage = parseFloat(positionSelector.value);
  const newWage = calculateNewWage(startWage);
  const dollarIncrease = (newWage - startWage).toFixed(2);
  const percentIncrease = (((newWage - startWage) / startWage) * 100).toFixed(2);

  // Update text
  initialWageDisplay.textContent = startWage.toFixed(2);
  newWageDisplay.textContent = newWage.toFixed(2);
  dollarIncreaseDisplay.textContent = dollarIncrease;
  percentIncreaseDisplay.textContent = percentIncrease;

  // Update chart
  chart.data.datasets[0].data = [startWage, newWage];
  chart.update();
}

// Event listener
positionSelector.addEventListener('change', updateDisplay);

// Initialize
positionSelector.selectedIndex = 0;
updateDisplay();

