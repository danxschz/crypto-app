import { getGlobalData } from './setListHeader';

const displayFooter = (globalData) => {
  const cryptos = document.querySelector('.cryptos-indicator');
  cryptos.textContent = globalData.data.active_cryptocurrencies.toLocaleString();

  const markets = document.querySelector('.markets-indicator');
  markets.textContent = globalData.data.markets.toLocaleString();

  const marketCap = document.querySelector('.market-cap-indicator');
  marketCap.textContent = `$${globalData.data.total_market_cap.usd.toLocaleString()}`;

  const dominance = document.querySelector('.dominance-indicator');
  const dominanceData = globalData.data.market_cap_percentage;
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

const setFooter = async () => {
  const globalData = await getGlobalData();
  displayFooter(globalData);
}

export default setFooter;
