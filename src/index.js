import './normalize.css';
import './style.scss';
import moment from 'moment';
import Chart from 'chart.js/auto';
import bitcoinFetch from './a';

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
    coinName.textContent = coin.name;
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

//setHome();
setIndicators();

const getCoin = async (coinId) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=true`, { mode: 'cors' });
  return response.json();
}

const generateElement = (type, elementClass, textContent, attributes) => {
  const element = document.createElement(type);
  if (elementClass) element.setAttribute('class', elementClass);
  if (textContent) element.textContent = textContent;
  for (let attribute in attributes) {
    element.setAttribute(attribute, attributes[attribute]);
  }
  return element;
}

const displayCoin = (coin) => {
  const main = document.querySelector('main');

  const category = generateElement('div', 'coin__category');
  const categoryLink = generateElement('a', false, 'Coins', {href: ''});
  category.appendChild(categoryLink);
  const categoryIcon = generateElement('i', 'fa-solid fa-chevron-right');
  category.appendChild(categoryIcon);
  const categoryValue = generateElement('span', 'coin__category__value', coin.name);
  category.appendChild(categoryValue);
  main.appendChild(category);

  const coinInfo = generateElement('div', 'coin__info');
  const coinInfoBasic = generateElement('div', 'coin__info__basic');

  const coinRank = generateElement('div', 'coin__rank', `Rank #${coin.market_cap_rank}`);
  coinInfoBasic.appendChild(coinRank);

  const coinIdentifier = generateElement('div', 'coin__identifier');
  const coinImg = generateElement('img', false, false, {src: coin.image.small});
  coinIdentifier.appendChild(coinImg);
  const coinName = generateElement('div', 'coin__name', coin.name);
  coinIdentifier.appendChild(coinName);
  const coinSymbol = generateElement('div', 'coin__symbol', coin.symbol);
  coinIdentifier.appendChild(coinSymbol);
  coinInfoBasic.appendChild(coinIdentifier);

  const coinLinks = generateElement('div', 'coin__links');

  const coinWebsite = generateElement('a', 'coin__link', false, {href: coin.links.homepage[0], target: '_blank'});
  const coinWebsiteIcon = generateElement('i', 'fa-solid fa-link');
  coinWebsite.appendChild(coinWebsiteIcon);
  const coinWebsiteValue = generateElement('span', false, 'Website')
  coinWebsite.appendChild(coinWebsiteValue);
  coinLinks.appendChild(coinWebsite);

  const coinExplorer = generateElement('a', 'coin__link', false, {href: coin.links.blockchain_site[0], target: '_blank'});
  const coinExplorerIcon = generateElement('i', 'fa-solid fa-magnifying-glass');
  coinExplorer.appendChild(coinExplorerIcon);
  const coinExplorerValue = generateElement('span', false, 'Explorer')
  coinExplorer.appendChild(coinExplorerValue);
  coinLinks.appendChild(coinExplorer);

  const coinCommunity = generateElement('a', 'coin__link', false, {href: coin.links.official_forum_url[0], target: '_blank'});
  const coinCommunityIcon = generateElement('i', 'fa-solid fa-user');
  coinCommunity.appendChild(coinCommunityIcon);
  const coinCommunityValue = generateElement('span', false, 'Community')
  coinCommunity.appendChild(coinCommunityValue);
  coinLinks.appendChild(coinCommunity);

  const coinSourceCode = generateElement('a', 'coin__link', false, {href: coin.links.repos_url.github[0], target: '_blank'});
  const coinSourceCodeIcon = generateElement('i', 'fa-solid fa-code');
  coinSourceCode.appendChild(coinSourceCodeIcon);
  const coinSourceCodeValue = generateElement('span', false, 'Source Code')
  coinSourceCode.appendChild(coinSourceCodeValue);
  coinLinks.appendChild(coinSourceCode);

  coinInfoBasic.appendChild(coinLinks);
  coinInfo.appendChild(coinInfoBasic);

  const coinInfoPrice = generateElement('div', 'coin__info__price');

  const coinPriceTitle = generateElement('div', 'coin__price__title', `${coin.name} Price (${coin.symbol.toUpperCase()})`);
  coinInfoPrice.appendChild(coinPriceTitle);

  const coinPrice = generateElement('div', 'coin__price');
  const coinPriceValue = generateElement('div', 'coin__price__value', `$${coin.market_data.current_price.usd.toLocaleString(undefined, {maximumFractionDigits: 7})}`);
  coinPrice.appendChild(coinPriceValue);

  const dayChange = generateElement('div', 'coin__price__change');
  const dayChangeIcon = document.createElement('i');
  if (coin.market_data.price_change_percentage_24h >= 0) {
    dayChangeIcon.setAttribute('class', 'fa-solid fa-caret-up');
    dayChange.style.background = '#41d9ab';
  } else {
    dayChangeIcon.setAttribute('class', 'fa-solid fa-caret-down');
    dayChange.style.background = '#ea3943';
  }
  const dayChangeValue = generateElement('div', false, `${coin.market_data.price_change_percentage_24h.toFixed(2).replace('-','')}%`);
  dayChange.appendChild(dayChangeIcon);
  dayChange.appendChild(dayChangeValue);
  coinPrice.appendChild(dayChange);
  coinInfoPrice.appendChild(coinPrice);

  const priceRange = generateElement('div', 'coin__price-range');

  const lowPrice = generateElement('div', 'coin__range');
  const lowPriceTitle = generateElement('div', 'coin__range__title', 'Low:');
  lowPrice.appendChild(lowPriceTitle);
  const lowPriceValue = generateElement('div', 'coin__range__value', `$${coin.market_data.low_24h.usd.toLocaleString(undefined, {maximumFractionDigits: 7})}`);
  lowPrice.appendChild(lowPriceValue);
  priceRange.appendChild(lowPrice);

  const priceRangeBar = generateElement('div', 'coin__range__bar');
  const priceBarPercentage = `${(((coin.market_data.current_price.usd - coin.market_data.low_24h.usd) / (coin.market_data.high_24h.usd - coin.market_data.low_24h.usd))*100).toFixed(0)}%`;
  priceRangeBar.style.background = `linear-gradient(to right, #21c9b8 0%, #21c9b8 ${priceBarPercentage}, #e1e1e1 ${priceBarPercentage}, #e1e1e1 100%)`;
  priceRange.appendChild(priceRangeBar);

  const highPrice = generateElement('div', 'coin__range');
  const highPriceTitle = generateElement('div', 'coin__range__title', 'High:');
  highPrice.appendChild(highPriceTitle);
  const highPriceValue = generateElement('div', 'coin__range__value', `$${coin.market_data.high_24h.usd.toLocaleString(undefined, {maximumFractionDigits: 7})}`);
  highPrice.appendChild(highPriceValue);
  priceRange.appendChild(highPrice);
  
  const rangeIndicator = generateElement('div', 'coin__range__indicator', '24h');
  priceRange.appendChild(rangeIndicator);

  coinInfoPrice.appendChild(priceRange)
  coinInfo.appendChild(coinInfoPrice);
  main.appendChild(coinInfo);

  const coinIndicators = generateElement('div', 'coin__indicators');

  const marketCap = generateElement('div', 'coin__indicator-section');
  const marketCapIndicator = generateElement('div', 'coin__indicator');
  const marketCapTitle = generateElement('div', 'coin__indicator__title', 'Market Cap');
  marketCapIndicator.appendChild(marketCapTitle);
  const marketCapValue = generateElement('div', 'coin__indicator__value', `$${coin.market_data.market_cap.usd.toLocaleString()}`);
  marketCapIndicator.appendChild(marketCapValue);
  marketCap.appendChild(marketCapIndicator);
  coinIndicators.appendChild(marketCap);

  const fullyDiluted = generateElement('div', 'coin__indicator-section');
  const fullyDilutedIndicator = generateElement('div', 'coin__indicator');
  const fullyDilutedTitle = generateElement('div', 'coin__indicator__title', 'Fully Diluted Valuation');
  fullyDilutedIndicator.appendChild(fullyDilutedTitle);
  const fullyDilutedValue = generateElement('div', 'coin__indicator__value', `$${coin.market_data.fully_diluted_valuation.usd.toLocaleString()}`);
  fullyDilutedIndicator.appendChild(fullyDilutedValue);
  fullyDiluted.appendChild(fullyDilutedIndicator);
  coinIndicators.appendChild(fullyDiluted);

  const volume = generateElement('div', 'coin__indicator-section');
  const volumeIndicator = generateElement('div', 'coin__indicator');
  const volumeTitle = generateElement('div', 'coin__indicator__title', '24h Volume');
  volumeIndicator.appendChild(volumeTitle);
  const volumeValue = generateElement('div', 'coin__indicator__value', `$${coin.market_data.total_volume.usd.toLocaleString()}`);
  volumeIndicator.appendChild(volumeValue);
  volume.appendChild(volumeIndicator);

  const volumeByMarketIndicator = generateElement('div', 'coin__indicator');
  const volumeByMarketTitle = generateElement('div', 'coin__indicator__title', 'Volume / Market Cap');
  volumeByMarketIndicator.appendChild(volumeByMarketTitle);
  const volumeByMarketValue = generateElement('div', 'coin__indicator__value', `${(coin.market_data.total_volume.usd / coin.market_data.market_cap.usd).toLocaleString(undefined, {minimumFractionDigits: 5})}`);
  volumeByMarketIndicator.appendChild(volumeByMarketValue);
  volume.appendChild(volumeByMarketIndicator);
  coinIndicators.appendChild(volume);

  const supply = generateElement('div', 'coin__indicator-section');
  const circulatingSupplyIndicator = generateElement('div', 'coin__indicator');
  const circulatingSupplyTitle = generateElement('div', 'coin__indicator__title', 'Circulating Supply');
  circulatingSupplyIndicator.appendChild(circulatingSupplyTitle);
  const circulatingSupplyValueDiv = generateElement('div', 'coin__indicator_horizontal');
  const circulatingSupplyValue = generateElement('div', 'coin__indicator__value', `${coin.market_data.circulating_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`);
  circulatingSupplyValueDiv.appendChild(circulatingSupplyValue);
  circulatingSupplyIndicator.appendChild(circulatingSupplyValueDiv);

  const circulatingSupplyBar = generateElement('div', 'coin__supply__bar');
  const supplyBarPercentage = `${((coin.market_data.circulating_supply / coin.market_data.max_supply)*100).toFixed(0)}%`;
  circulatingSupplyBar.style.background = `linear-gradient(to right, #21c9b8 0%, #21c9b8 ${supplyBarPercentage}, #e1e1e1 ${supplyBarPercentage}, #e1e1e1 100%)`;
  circulatingSupplyIndicator.appendChild(circulatingSupplyBar);

  const supplyBarPercentageElement = generateElement('div', 'coin__indicator__title', supplyBarPercentage);
  circulatingSupplyValueDiv.appendChild(supplyBarPercentageElement);
  supply.appendChild(circulatingSupplyIndicator);

  const totalMaxSupply = generateElement('div', 'coin__indicator');

  const totalSupplyIndicator = generateElement('div', 'coin__indicator_horizontal');
  const totalSupplyTitle = generateElement('div', 'coin__indicator__title', 'Total Supply');
  totalSupplyIndicator.appendChild(totalSupplyTitle);
  const totalSupplyValue = generateElement('div', 'coin__indicator__value', `${coin.market_data.total_supply.toLocaleString()}`);
  totalSupplyIndicator.appendChild(totalSupplyValue);
  totalMaxSupply.appendChild(totalSupplyIndicator);

  const maxSupplyIndicator = generateElement('div', 'coin__indicator_horizontal');
  const maxSupplyTitle = generateElement('div', 'coin__indicator__title', 'Max Supply');
  maxSupplyIndicator.appendChild(maxSupplyTitle);
  const maxSupplyValue = generateElement('div', 'coin__indicator__value', `${coin.market_data.max_supply.toLocaleString()}`);
  maxSupplyIndicator.appendChild(maxSupplyValue);
  totalMaxSupply.appendChild(maxSupplyIndicator);
  supply.appendChild(totalMaxSupply);

  coinIndicators.appendChild(supply);
  main.appendChild(coinIndicators);
}

const setCoin = async () => {
  const coin = await getCoin('bitcoin');
  //displayCoin(bitcoinFetch);
  displayCoin(coin);
}

setCoin();