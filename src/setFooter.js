import { getGlobalData } from './setListHeader';

const displayFooter = (globalData) => {
  const { active_cryptocurrencies, markets, total_market_cap, market_cap_percentage} = globalData.data;

  const cryptos = document.querySelector('.cryptos-indicator');
  cryptos.textContent = active_cryptocurrencies.toLocaleString();

  const market = document.querySelector('.markets-indicator');
  market.textContent = markets.toLocaleString();

  const marketCap = document.querySelector('.market-cap-indicator');
  marketCap.textContent = `$${total_market_cap.usd.toLocaleString()}`;

  const dominance = document.querySelector('.dominance-indicator');
  const dominanceData = market_cap_percentage;
  let dominanceValue = '';

  // Get top 2 coins
  let i = 0
  for (let coin in dominanceData) {
    if (i > 1) break;
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
