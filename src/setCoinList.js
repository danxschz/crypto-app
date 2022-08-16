import './styles/coinList.scss';
import generateElement from 'generate-element';
import Chart from 'chart.js/auto';

const getCoinList = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&price_change_percentage=7d', { mode: 'cors' });
  const json = await response.json();
  return json;
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

const chartOptions = {
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

const displayCoinList = (coinList) => {
  const main = document.querySelector('main > div');
  const table = document.createElement('table');

  const tableCaption = generateElement('caption', false, 'Cryptocurrency Prices by Market Cap');
  table.appendChild(tableCaption);

  const tableHead = document.createElement('thead');
  const tableHeadRow = document.createElement('tr');

  const tableHeaderRank = generateElement('th', 'outer-left', '#', {scope: 'col'});
  tableHeadRow.append(tableHeaderRank);
  const tableHeaderCoin = generateElement('th', 'coin-th', 'Coin', {scope: 'col'});
  tableHeadRow.append(tableHeaderCoin);
  const tableHeaderPrice = generateElement('th', false, 'Price', {scope: 'col'});
  tableHeadRow.append(tableHeaderPrice);
  const tableHeaderDay = generateElement('th', false, '24h', {scope: 'col'});
  tableHeadRow.append(tableHeaderDay);
  const tableHeaderWeek = generateElement('th', false, '7d', {scope: 'col'});
  tableHeadRow.append(tableHeaderWeek);
  const tableHeaderMarket = generateElement('th', false, 'Market Cap', {scope: 'col'});
  tableHeadRow.append(tableHeaderMarket);
  const tableHeaderLastDays = generateElement('th', 'outer-right', 'Last 7 Days', {scope: 'col'});
  tableHeadRow.append(tableHeaderLastDays);

  tableHead.appendChild(tableHeadRow);
  table.appendChild(tableHead);

  const tableBody = generateElement('tbody', 'coins');

  coinList.forEach((coin) => {
    const { 
      id, 
      market_cap_rank, 
      image, 
      name, 
      symbol, 
      current_price, 
      price_change_percentage_24h, 
      price_change_percentage_7d_in_currency, 
      market_cap,
      sparkline_in_7d,
    } = coin;

    const coinRow = generateElement('tr', 'coin-row', false, { 'data-id': id });

    const coinRank = generateElement('td', 'coin-row__rank outer-left', market_cap_rank);
    coinRow.appendChild(coinRank);

    const coinIdentifier = document.createElement('td');
    const coinIdentifierDiv = generateElement('div', 'coin-row__identifier');

    const coinImg = generateElement('img', false, false, { src: image, alt: `${name} logo` });
    coinIdentifierDiv.appendChild(coinImg);

    const coinName = generateElement('div', 'coin-row__name', name);
    coinIdentifierDiv.appendChild(coinName);

    const coinSymbol = generateElement('div', 'coin-row__symbol', symbol);
    coinIdentifierDiv.appendChild(coinSymbol);

    coinIdentifier.appendChild(coinIdentifierDiv);
    coinRow.appendChild(coinIdentifier);

    const coinPrice = generateElement('td', 'coin-row__price', `$${current_price.toLocaleString(undefined, { maximumFractionDigits: 7 })}`);
    coinRow.appendChild(coinPrice);

    const dayChange = document.createElement('td');
    const dayChangeDiv = generateElement('div', 'coin-row__change');

    const dayChangeIcon = document.createElement('i');
    const dayChangeValue = generateElement('div', false, `${price_change_percentage_24h.toFixed(2).replace('-','')}%`);
    styleChangePercentage(price_change_percentage_24h, dayChangeIcon, dayChangeValue);
    dayChangeDiv.appendChild(dayChangeIcon);
    dayChangeDiv.appendChild(dayChangeValue);
    dayChange.appendChild(dayChangeDiv);
    coinRow.appendChild(dayChange);

    const weekChange = document.createElement('td');
    const weekChangeDiv = generateElement('div', 'coin-row__change');

    const weekChangeIcon = document.createElement('i');
    const weekChangeValue = generateElement('div', false, `${price_change_percentage_7d_in_currency.toFixed(2).replace('-', '')}%`);
    styleChangePercentage(price_change_percentage_7d_in_currency, weekChangeIcon, weekChangeValue);
    weekChangeDiv.appendChild(weekChangeIcon)
    weekChangeDiv.appendChild(weekChangeValue);
    weekChange.appendChild(weekChangeDiv)
    coinRow.appendChild(weekChange);

    const marketCap = generateElement('td', 'coin-row__cap', `$${market_cap.toLocaleString()}`);
    coinRow.appendChild(marketCap);

    const lastDays = generateElement('td', 'coin-row__last-days outer-right');
    const ctx = document.createElement('canvas');
    const chartData = sparkline_in_7d.price;
    const labels = [];
    for (let i = 1; i <= chartData.length; i += 1) {
      labels.push(i);
    }

    const chartColor = (price_change_percentage_7d_in_currency >= 0) ? '#41d9ab' : '#ea3943';

    const data = {
      labels: labels,
      datasets: [{
        data: chartData,
        fill: false,
        borderColor: chartColor,
        tension: 0.1
      }]
    };

    new Chart(ctx, {
      type: 'line',
      data: data,
      options: chartOptions,
    });

    lastDays.appendChild(ctx);
    coinRow.appendChild(lastDays);
    tableBody.appendChild(coinRow);
  });

  table.appendChild(tableBody);
  main.appendChild(table);
}

const setCoinList = async () => {
  const coinList = await getCoinList();
  displayCoinList(coinList);
}

export default setCoinList;
