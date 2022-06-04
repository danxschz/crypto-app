import moment from 'moment';
import './normalize.css';
import './style.scss';

const date = document.querySelector('.date');
date.textContent = moment().format("dddd, MMMM Do YYYY");

const getCoins = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false', { mode: 'cors' });
  return response.json();
}

const displayCoins = (coins) => {
  const coinsDiv = document.querySelector('.coins');

  coins.forEach(coin => {
    const coinDiv = document.createElement('div');
    coinDiv.classList.add('coin');

    const coinName = document.createElement('div');
    coinName.textContent = coin.id;
    coinDiv.appendChild(coinName);

    const coinSymbol = document.createElement('div');
    coinSymbol.textContent = coin.symbol;
    coinDiv.appendChild(coinSymbol);

    const coinPrice = document.createElement('div');
    coinPrice.textContent = `$${coin.current_price.toLocaleString()}`;
    coinDiv.appendChild(coinPrice);

    const priceChange = document.createElement('div');
    priceChange.textContent = coin.price_change_percentage_24h.toFixed(2);
    coinDiv.appendChild(priceChange);

    const marketCap = document.createElement('div');
    marketCap.textContent = `$${coin.market_cap.toLocaleString()}`;
    coinDiv.appendChild(marketCap);

    coinsDiv.appendChild(coinDiv);
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

const setIndicators = async () => {
  const indicators = await getIndicators();
  displayIndicators(indicators);
}

setCoins();
setIndicators();