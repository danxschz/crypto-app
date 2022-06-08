import './normalize.css';
import './style.scss';
import moment from 'moment';
import Chart from 'chart.js/auto';

const date = document.querySelector('.date');
date.textContent = moment().format('dddd, MMMM Do YYYY');

const getIndicators = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/global', { mode: 'cors' });
  return response.json();
}

const SI_SYMBOL = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
const abbreviateNumber = (number) => {
  // Determine SI symbol
  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);
  if (tier == 0) return number;

  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;
  return scaled.toFixed(2) + suffix;
}

const displayMarketCap = (indicators) => {
  const marketCap = document.querySelector('.description__market-cap');
  marketCap.textContent = `$${abbreviateNumber(indicators.data.total_market_cap.usd)}`;

  const changePercentage = document.querySelector('.description__percentage');
  const change = document.querySelector('.description__change');
  if (indicators.data.market_cap_change_percentage_24h_usd >= 0) {
    changePercentage.classList.add('positive');
    change.textContent = 'increase';
  } else {
    changePercentage.classList.add('negative');
    change.textContent = 'decrease';
  }
  changePercentage.textContent = `${indicators.data.market_cap_change_percentage_24h_usd.toFixed(2).replace('-', '')}%`;
}

const getCoins = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d', { mode: 'cors' });
  return response.json();
}

const styleChangePercentage = (changePercentage, iconElement, valueElement) => {
  if (changePercentage >= 0) {
    iconElement.setAttribute('class', 'fa-solid fa-caret-up positive');
    valueElement.classList.add('positive');
  } else {
    iconElement.setAttribute('class', 'fa-solid fa-caret-down negative');
    valueElement.classList.add('negative');
  }
}

const displayCoins = (coins) => {
  console.log(coins);
  const coinsTable = document.querySelector('.coins');

  coins.forEach((coin) => {
    const coinRow = document.createElement('tr');
    coinRow.classList.add('coin-row');

    const coinRank = document.createElement('td');
    coinRank.setAttribute('class', 'coin-row__rank outer-left');
    coinRank.textContent = coin.market_cap_rank;
    coinRow.appendChild(coinRank);

    const coinIdentifier = document.createElement('td');
    const coinIdentifierDiv = document.createElement('div');
    coinIdentifierDiv.classList.add('coin-row__identifier');

    const coinImg = document.createElement('img');
    coinImg.src = coin.image;
    coinIdentifierDiv.appendChild(coinImg);

    const coinName = document.createElement('div');
    coinName.classList.add('coin-row__name');
    coinName.textContent = coin.id;
    coinIdentifierDiv.appendChild(coinName);

    const coinSymbol = document.createElement('div');
    coinSymbol.classList.add('coin-row__symbol');
    coinSymbol.textContent = coin.symbol;
    coinIdentifierDiv.appendChild(coinSymbol);

    coinIdentifier.appendChild(coinIdentifierDiv);
    coinRow.appendChild(coinIdentifier);

    const coinPrice = document.createElement('td');
    coinPrice.classList.add('coin-row__price');
    coinPrice.textContent = `$${coin.current_price.toLocaleString(undefined, {maximumFractionDigits: 7})}`;
    coinRow.appendChild(coinPrice);

    const dayChange = document.createElement('td');
    const dayChangeDiv = document.createElement('div');
    dayChangeDiv.classList.add('coin-row__change');

    const dayChangeIcon = document.createElement('i');
    const dayChangeValue = document.createElement('div');
    styleChangePercentage(coin.price_change_percentage_24h, dayChangeIcon, dayChangeValue);
    dayChangeValue.textContent = `${coin.price_change_percentage_24h.toFixed(2).replace('-','')}%`;

    dayChangeDiv.appendChild(dayChangeIcon);
    dayChangeDiv.appendChild(dayChangeValue);
    dayChange.appendChild(dayChangeDiv);
    coinRow.appendChild(dayChange);

    const weekChange = document.createElement('td');
    const weekChangeDiv = document.createElement('div');
    weekChangeDiv.classList.add('coin-row__change');

    const weekChangeIcon = document.createElement('i');
    const weekChangeValue = document.createElement('div');
    styleChangePercentage(coin.price_change_percentage_7d_in_currency, weekChangeIcon, weekChangeValue);
    weekChangeValue.textContent = `${coin.price_change_percentage_7d_in_currency.toFixed(2).replace('-', '')}%`;

    weekChangeDiv.appendChild(weekChangeIcon)
    weekChangeDiv.appendChild(weekChangeValue);
    weekChange.appendChild(weekChangeDiv)
    coinRow.appendChild(weekChange);

    const marketCap = document.createElement('td');
    marketCap.classList.add('coin-row__cap');
    marketCap.textContent = `$${coin.market_cap.toLocaleString()}`;
    coinRow.appendChild(marketCap);

    const lastDays = document.createElement('td');
    lastDays.setAttribute('class', 'coin-row__last-days outer-right');
    const ctx = document.createElement('canvas');

    const chartData = coin.sparkline_in_7d.price;
    const chartColor = (coin.price_change_percentage_7d_in_currency >= 0) ? '#41d9ab':'#dc3434';

    const labels = [];
    for (let i = 1; i <= chartData.length; i += 1) {
      labels.push(i);
    }

    const data = {
      labels: labels,
      datasets: [{
        data: chartData,
        fill: false,
        borderColor: chartColor,
        tension: 0.1
      }]
    };

    const chart = new Chart(ctx, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        borderWidth: 2,
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
        },
        events: [],
      }
    });

    lastDays.appendChild(ctx);
    coinRow.appendChild(lastDays);
    coinsTable.appendChild(coinRow);
  });
}

const setHome = async () => {
  const indicators = await getIndicators();
  displayMarketCap(indicators);
  const coins = await getCoins();
  displayCoins(coins);
}

const displayIndicators = (indicators) => {
  const cryptos = document.querySelector('.cryptos-indicator');
  cryptos.textContent = indicators.data.active_cryptocurrencies.toLocaleString();

  const markets = document.querySelector('.markets-indicator');
  markets.textContent = indicators.data.markets.toLocaleString();

  const marketCap = document.querySelector('.market-cap-indicator');
  marketCap.textContent = `$${indicators.data.total_market_cap.usd.toLocaleString()}`;

  const dominance = document.querySelector('.dominance-indicator');
  const dominanceData = indicators.data.market_cap_percentage;
  let dominanceValue = '';

  // Get top 2 coins
  let i = 0
  for (let coin in dominanceData) {
    if (i >= 2) break;
    dominanceValue += ` ${coin}: ${dominanceData[coin].toFixed(1)}%`
    i += 1;
  }

  dominance.textContent = dominanceValue.trim().toUpperCase();
}

const setIndicators = async () => {
  const indicators = await getIndicators();
  displayIndicators(indicators);
}

setHome();
setIndicators();

const getCoin = async (coinId) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`, { mode: 'cors' });
  return response.json();
}

const displayCoin = (coin) => {
  const main = document.querySelector('main');

  const category = document.createElement('div');
  category.classList.add('coin__category');

  const categoryContent = document.createElement('span');
  categoryContent.classList.add('coin__category__content');
  categoryContent.textContent = 'Coin'
  category.appendChild(categoryContent);

  const categoryBracket = document.createElement('span');
  categoryBracket.classList.add('coin__category__bracket');
  categoryBracket.textContent = '>';
  category.appendChild(categoryBracket);

  const categoryValue = document.createElement('span');
  categoryValue.classList.add('coin__category__value');
  categoryValue.textContent = coin.name;
  category.appendChild(categoryValue);
  main.appendChild(category);

  const coinRank = document.createElement('div');
  coinRank.classList.add('coin__rank');
  coinRank.textContent = `Rank #${coin.market_cap_rank}`;
  main.appendChild(coinRank);

  const coinIdentifier = document.createElement('div');
  coinIdentifier.classList.add('coin__identifier');

  const coinImg = document.createElement('img');
  coinImg.src = coin.image.large;
  coinIdentifier.appendChild(coinImg);

  const coinName = document.createElement('div');
  coinName.classList.add('coin__name');
  coinName.textContent = coin.name;
  coinIdentifier.appendChild(coinName);

  const coinSymbol = document.createElement('div');
  coinSymbol.classList.add('coin__symbol');
  coinSymbol.textContent = coin.symbol;
  coinIdentifier.appendChild(coinSymbol);
  main.appendChild(coinIdentifier);

}