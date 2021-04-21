
const currentDateTime = new Date().toISOString();
let dataInnerObj = {};
let times = [];
let forecast = [];
let index = [];

//XML HTTP Request
// const request = new XMLHttpRequest();
// request.open(`GET`, `https://api.carbonintensity.org.uk/intensity/${currentDateTime}/fw24h`);
// request.send();

// const request = fetch(`https://api.carbonintensity.org.uk/intensity/${currentDateTime}/fw24h`);
// console.log(`Request: ${request}`);

// request.addEventListener('load', function() {
//   const apiData = JSON.parse(this.responseText).data;
//   console.log(apiData);
//   apiData.forEach(getForecastValue);
//   apiData.forEach(getForecastIndex);

//   createChart();
// });

//Fetch API call
const getCarbonData = function() {
  fetch(`https://api.carbonintensity.org.uk/intensity/${currentDateTime}/fw24h`)
    .then((response) => response.json())
    .then( function(data) {
      data.data.forEach(getForecastValue);
      data.data.forEach(getForecastIndex);

      createChart();
    });
}

function getForecastValue(item) {
  times.push(convertToTime(item['from']));
  forecast.push(item['intensity']['forecast']);
}

function getForecastIndex(item) {
  index.push(item['intensity']['index']);
}

function convertToTime(timestamp) {
  const time = timestamp.slice(11, 16);
  return time;
}

function createChart() {
  const ctx = document.getElementById('chart');
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: times,
      datasets: [{
        label: 'Time',
        data: forecast,
        backgroundColor: bgGradient(),
        borderColor: [
            'rgba(0, 0, 0, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [{
            gridLines: {
              drawOnChartArea: false
            },
            scaleLabel: {
              display: true,
              labelString: 'Time',
              fontSize: 16
            }
        }],
        yAxes: [{
          gridLines: {
            drawOnChartArea: false
          },
          scaleLabel: {
            display: true,
            labelString: 'Amount of carbon to produce electricity',
            fontSize: 16
          }
        }]
      },
      legend: {
        display: false
      }
    }
  });
}

function bgGradient() {
  const canvas = document.getElementById('chart');
  const ctx = canvas.getContext('2d');
  let gradient = ctx.createLinearGradient(0, 0, window.innerWidth, 0);
  let xInterval = 0;
  index.forEach((item) => {
    if (item === 'high') {
      gradient.addColorStop(xInterval, '#ff150080');
    } else if (item === 'moderate') {
      gradient.addColorStop(xInterval, '#ffd00080');
    } else if (item === 'low') {
      gradient.addColorStop(xInterval, '#0bcf04B8');
    } else {
      gradient.addColorStop(xInterval, '#fff');
    }
    xInterval += 0.02;
  });

  return gradient;
}

getCarbonData();
