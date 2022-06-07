import moment from 'moment';
import './normalize.css';
import './style.scss';
import Chart from 'chart.js/auto';

const date = document.querySelector('.date');
date.textContent = moment().format("dddd, MMMM Do YYYY");

const getCoins = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d', { mode: 'cors' });
  return response.json();
}

const setChangePercentage = (changePercentage, iconElement, valueElement) => {
  if (changePercentage >= 0) {
    iconElement.setAttribute('class', 'fa-solid fa-caret-up positive');
    valueElement.classList.add('positive');
  } else {
    iconElement.setAttribute('class', 'fa-solid fa-caret-down negative');
    valueElement.classList.add('negative');
  }
}

const displayCoins = (coins) => {
  const coinsTable = document.querySelector('.coins');
  console.log(coins);

  coins.forEach(coin => {
    const coinRow = document.createElement('tr');
    coinRow.classList.add('coin');

    const coinRank = document.createElement('td');
    coinRank.setAttribute('class', 'coin__rank outer-left');
    coinRank.textContent = coin.market_cap_rank;
    coinRow.appendChild(coinRank);

    const coinIdentifier = document.createElement('td');

    const coinIdentifierFlex = document.createElement('div');
    coinIdentifierFlex.classList.add('coin__identifier');

    const coinImg = document.createElement('img');
    coinImg.src = coin.image;
    coinIdentifierFlex.appendChild(coinImg);

    const coinName = document.createElement('span');
    coinName.classList.add('coin__name');
    coinName.textContent = coin.id;
    coinIdentifierFlex.appendChild(coinName);

    const coinSymbol = document.createElement('span');
    coinSymbol.classList.add('coin__symbol');
    coinSymbol.textContent = coin.symbol;
    coinIdentifierFlex.appendChild(coinSymbol);

    coinIdentifier.appendChild(coinIdentifierFlex);

    coinRow.appendChild(coinIdentifier);

    const coinPrice = document.createElement('td');
    coinPrice.classList.add('coin__price');
    coinPrice.textContent = `$${coin.current_price.toLocaleString()}`;
    coinRow.appendChild(coinPrice);

    const dayChange = document.createElement('td');
    const dayChangeDiv = document.createElement('div');
    dayChangeDiv.classList.add('coin__change');

    const dayChangeIcon = document.createElement('i');
    const dayChangeValue = document.createElement('div');
    setChangePercentage(coin.price_change_percentage_24h, dayChangeIcon, dayChangeValue);
    dayChangeDiv.appendChild(dayChangeIcon);
    dayChangeValue.textContent = `${coin.price_change_percentage_24h.toFixed(2).replace('-','')}%`;
    dayChangeDiv.appendChild(dayChangeValue);
    dayChange.appendChild(dayChangeDiv);
    coinRow.appendChild(dayChange);

    const weekChange = document.createElement('td');
    const weekChangeDiv = document.createElement('div');
    weekChangeDiv.classList.add('coin__change');

    const weekChangeIcon = document.createElement('i');
    const weekChangeValue = document.createElement('div');
    setChangePercentage(coin.price_change_percentage_7d_in_currency, weekChangeIcon, weekChangeValue);
    weekChangeDiv.appendChild(weekChangeIcon)

    weekChangeValue.textContent = `${coin.price_change_percentage_7d_in_currency.toFixed(2).replace('-', '')}%`;
    weekChangeDiv.appendChild(weekChangeValue);
    weekChange.appendChild(weekChangeDiv)
    coinRow.appendChild(weekChange);

    const marketCap = document.createElement('td');
    marketCap.classList.add('coin__cap');
    marketCap.textContent = `$${coin.market_cap.toLocaleString()}`;
    coinRow.appendChild(marketCap);

    const lastDays = document.createElement('td');
    lastDays.setAttribute('class', 'coin__last outer-right');
    const ctx = document.createElement('canvas');
    let chartArray = coin.sparkline_in_7d.price;
    const labels = [];
    let color = (coin.price_change_percentage_7d_in_currency >= 0) ? '#41d9ab':'#dc3434';
    for (let i=1; i<=168; i++) {
      labels.push(i);
    }
    console.log(labels);
    console.log(chartArray);
    const data = {
      labels: labels,
      datasets: [{
        data: chartArray,
        fill: false,
        borderColor: color,
        tension: 0.1
      }]
    };

    lastDays.appendChild(ctx);
    coinRow.appendChild(lastDays);
    

    const myChart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        borderWidth: 2,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
             display: false
          }
        },
        scales: {
          x: {
            display: false
          },
          y: {
            display: false
          }
        },
        elements: {
          point:{
            radius: 0
        }
      }
      }
    });

    coinsTable.appendChild(coinRow);
  });
}

const setCoins = async () => {
  const coins = await getCoins();
  displayCoins(coins);
}

const getIndicators = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/global', { mode: 'cors' });
  return response.json();
}

const displayIndicators = (indicators) => {
  const cryptos = document.querySelector('.cryptos');
  const cryptosValue = indicators.data.active_cryptocurrencies;
  cryptos.textContent = cryptosValue.toLocaleString();

  const markets = document.querySelector('.markets');
  const marketsValue = indicators.data.markets;
  markets.textContent = marketsValue.toLocaleString();

  const marketCap = document.querySelector('.market-cap');
  const marketCapValue = indicators.data.total_market_cap.usd;
  marketCap.textContent = `$${marketCapValue.toLocaleString()}`;

  const dominance = document.querySelector('.dominance');
  const dominanceData = indicators.data.market_cap_percentage;
  let dominanceValue = '';
  let i = 0

  // Get top 2 coins
  for (let coin in dominanceData) {
    if (i >= 2) break;
    dominanceValue += ` ${coin}: ${dominanceData[coin].toFixed(1)}%`
    i += 1;
  }

  dominance.textContent = dominanceValue.trim().toUpperCase();
}

const displayMarketCap = (indicators) => {
  const marketCap = document.querySelector('.market-cap-2');
  marketCap.textContent = `$${abbreviateNumber(indicators.data.total_market_cap.usd)}`;

  const marketPercentage = document.querySelector('.market-percentage');
  const change = document.querySelector('.change');
  if (indicators.data.market_cap_change_percentage_24h_usd >= 0) {
    marketPercentage.classList.add('positive');
    change.textContent = 'increase';
  } else {
    marketPercentage.classList.add('negative');
    change.textContent = 'decrease';
  }
  marketPercentage.textContent = `${indicators.data.market_cap_change_percentage_24h_usd.toFixed(2).replace('-', '')}%`;
}

const setIndicators = async () => {
  const indicators = await getIndicators();
  console.log(indicators);
  displayIndicators(indicators);
  displayMarketCap(indicators);
}

setCoins();
setIndicators();

var SI_SYMBOL = ["", "k", "M", "G", "T", "P", "E"];

function abbreviateNumber(number){

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(2) + suffix;
}

