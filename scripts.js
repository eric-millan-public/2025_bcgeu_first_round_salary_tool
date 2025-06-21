// === DOM Elements ===
const wageSlider = document.getElementById('wageSlider');
const sliderValueDisplay = document.getElementById('sliderValue');
const initialWageDisplay = document.getElementById('initialWage');
const newWageDisplay = document.getElementById('newWage');
const dollarIncreaseDisplay = document.getElementById('dollarIncrease');
const percentIncreaseDisplay = document.getElementById('percentIncrease');

// === BC Inflation Rates (actual CPI % for each year to 2024) ===
const bcInflationRates = [
  { year: 2000, rate: 1.8 },
  { year: 2001, rate: 1.7 },
  { year: 2002, rate: 2.4 },
  { year: 2003, rate: 2.2 },
  { year: 2004, rate: 2.0 },
  { year: 2005, rate: 2.0 },
  { year: 2006, rate: 1.7 },
  { year: 2007, rate: 1.8 },
  { year: 2008, rate: 2.1 },
  { year: 2009, rate: 0.0 },
  { year: 2010, rate: 1.3 },
  { year: 2011, rate: 2.4 },
  { year: 2012, rate: 1.1 },
  { year: 2013, rate: -0.1 },
  { year: 2014, rate: 1.0 },
  { year: 2015, rate: 1.1 },
  { year: 2016, rate: 1.8 },
  { year: 2017, rate: 2.1 },
  { year: 2018, rate: 2.7 },
  { year: 2019, rate: 2.3 },
  { year: 2020, rate: 0.8 },
  { year: 2021, rate: 2.8 },
  { year: 2022, rate: 6.9 },
  { year: 2023, rate: 3.9 },
  { year: 2024, rate: 2.6 }
];

// === Raise History used for reconstructing actual past wages ===
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

// === Compute real wage history based on a known 2024 value ===
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

// === Forward project wages using 4-step offer ===
function calculateFutureWages(currentWage) {
  let future = [];
  let wage = currentWage;

  wage = wage * 1.005 + 0.15; // 2025.0
  future.push({ year: 2025.0, wage: parseFloat(wage.toFixed(2)) });

  wage = wage * 1.005 + 0.15; // 2025.5
  future.push({ year: 2025.5, wage: parseFloat(wage.toFixed(2)) });

  wage = wage * 1.01; // 2026.0
  future.push({ year: 2026.0, wage: parseFloat(wage.toFixed(2)) });

  wage = wage * 1.01; // 2026.5
  future.push({ year: 2026.5, wage: parseFloat(wage.toFixed(2)) });

  return future;
}

// === Build inflation multipliers from each year to 2024 ===
function buildInflationMultipliers() {
  const multipliers = {};
  let factor = 1.0;

  for (let i = bcInflationRates.length - 1; i >= 0; i--) {
    const { year, rate } = bcInflationRates[i];
    multipliers[year] = factor;
    factor *= 1 + rate / 100;
  }

  return multipliers;
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

// === Main Update ===
function updateDisplay() {
  const currentWage = parseFloat(wageSlider.value);
  sliderValueDisplay.textContent = currentWage.toFixed(2);

  const pastWages = backCalculateWages(currentWage);
  const futureWages = calculateFutureWages(currentWage);
  const combined = [...pastWages, ...futureWages];

  const years = combined.map(e => e.year);
  const rawWages = combined.map(e => e.wage);

  // Inflation-adjusted values to 2024 dollars
  const multipliers = buildInflationMultipliers();
  const adjustedWages = combined.map(({ year, wage }) => {
    const m = multipliers[year] ?? 1;
    return parseFloat((wage * m).toFixed(2));
  });

  // Update chart
  wageChart.data.labels = years;
  wageChart.data.datasets = [
    {
      label: "Act


