import './normalize.css';
import './style.scss';
import moment from 'moment';
import setCoin from './setCoin';
//import bitcoinFetch from './a';

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
setCoin('bitcoin');
