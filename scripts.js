// === DOM Elements ===
const wageSlider = document.getElementById('wageSlider');
const sliderValueDisplay = document.getElementById('sliderValue');
const initialWageDisplay = document.getElementById('initialWage');
const newWageDisplay = document.getElementById('newWage');
const dollarIncreaseDisplay = document.getElementById('dollarIncrease');
const percentIncreaseDisplay = document.getElementById('percentIncrease');

// === Raise History (most recent first, for back-calculation) ===
const raiseHistory = [
  { year: 2024, pct: 3.0 },
  { year: 2023, pct: 6.75 },
  { year: 2022, pct: 3.24 },
  { year: 2021, pct: 2.0 },
  { year: 2020, pct: 2.0 },
  { year: 2019, pct: 3.0 },
  { year: 2018, pct: 1.5 },
  { year: 2017, pct: 1.5 },
  { year: 2016, pct: 0.5 },
  { year: 2015, pct: 1.0 },
  { year: 2014, pct: 0.0 },
  { year: 2013, pct: 2.0 },
  { year: 2012, pct: 2.0 },
  { year: 2011, pct: 0.0 },
  { year: 2010, pct: 0.0 },
  { year: 2009, pct: 0.0 },
  { year: 2008, pct: 2.5 },
  { year: 2007, pct: 3.0 },
  { year: 2006, pct: 2.5 },
  { year: 2005, pct: 0.0 },
  { year: 2004, pct: 0.0 },
  { year: 2003, pct: 3.2 },
  { year: 2002, pct: 2.5 },
  { year: 2001, pct: 2.5 },
  { year: 2000, pct: 2.4 }
];

// === Future Offer: 4 raises (0.5% + $0.15, 0.5% + $0.15, 1%, 1%) ===
function calculateFutureWages(currentWage) {
  let future = [];
  let wage = currentWage;

  wage = wage * 1.005 + 0.15; // 6 months in
  future.push({ year: 2025.0, wage: parseFloat(wage.toFixed(2)) });

  wage = wage * 1.005 + 0.15; // 12 months in
  future.push({ year: 2025.5, wage: parseFloat(wage.toFixed(2)) });

  wage = wage * 1.01; // 18 months
  future.push({ year: 2026.0, wage: parseFloat(wage.toFixed(2)) });

  wage = wage * 1.01; // 24 months
  future.push({ year: 2026.5, wage: parseFloat(wage.toFixed(2)) });

  return future;
}

// === Back-calculate historical wages from latest wage ===
function backCalculateWages(latestWage) {
  let wages = [];
  let currentWage = latestWage;

  for (let i = 0; i < raiseHistory.length; i++) {
    const { year, pct } = raiseHistory[i];
    wages.unshift({ year, wage: parseFloat(currentWage.toFixed(2)) });
    currentWage = currentWage / (1 + pct / 100);
  }

  return wages;
}

// === Chart Setup ===
const ctx = document.getElementById('myChart').getContext('2d');
let wageChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: []
  },
  options: {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    },
    scales: {
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: "Hourly Wage ($)"
        }
      },
      x: {
        title: {
          display: true,
          text: "Year"
        }
      }
    }
  }
});

// === Update All Displays ===
function updateDisplay() {
  const currentWage = parseFloat(wageSlider.value);
  sliderValueDisplay.textContent = currentWage.toFixed(2);

  // Back-calculate past wages and future offers
  const pastWages = backCalculateWages(currentWage);
  const futureWages = calculateFutureWages(currentWage);

  // Merge time series
  const combined = [...pastWages, ...futureWages];

  // Extract values
  const years = combined.map(e => e.year);
  const wages = combined.map(e => e.wage);

  // Update chart
  wageChart.data.labels = years;
  wageChart.data.datasets = [{
    label: "Adjusted Wage Over Time",
    data: wages,
    borderColor: '#4caf50',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    tension: 0.1
  }];
  wageChart.update();

  // Summary
  const finalWage = futureWages[futureWages.length - 1].wage;
  const dollarIncrease = (finalWage - currentWage).toFixed(2);
  const percentIncrease = (((finalWage - currentWage) / currentWage) * 100).toFixed(2);

  initialWageDisplay.textContent = currentWage.toFixed(2);
  newWageDisplay.textContent = finalWage.toFixed(2);
  dollarIncreaseDisplay.textContent = dollarIncrease;
  percentIncreaseDisplay.textContent = percentIncrease;
}

// === Initialize ===
wageSlider.addEventListener('input', updateDisplay);
updateDisplay();

