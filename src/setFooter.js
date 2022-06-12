import generateElement from "./generateElement";

const getGlobalData = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/global', { mode: 'cors' });
  return response.json();
}

const siSymbols = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
const abbreviateNumber = (number) => {
  // Determine SI symbol
  const tier = Math.floor(Math.log10(Math.abs(number)) / 3);
  if (tier == 0) return number;

  // Scale and append suffix
  const suffix = siSymbols[tier];
  const scale = Math.pow(10, tier * 3);
  const scaled = number / scale;
  return scaled.toFixed(2) + suffix;
}

const displayMarketCap = (globalData) => {
  const main = document.querySelector('main');
  const description = generateElement('div', 'description');
  const heading = generateElement('h1', false, 'Cryptocurrency Prices by Market Cap');
  description.appendChild(heading);

  const paragraph = document.createElement('p');
  let text = generateElement('span', false, 'The global crypto market cap is ');
  paragraph.appendChild(text);

  const marketCap = generateElement('span', 'description__market-cap', `$${abbreviateNumber(globalData.data.total_market_cap.usd)}`);
  paragraph.appendChild(marketCap);

  text = generateElement('span', false, ', a ');
  paragraph.appendChild(text);

  const changePercentage = generateElement('span', 'description__percentage', `${globalData.data.market_cap_change_percentage_24h_usd.toFixed(2).replace('-', '')}%`);
  const changeWord = generateElement('span', 'description__change');
  if (globalData.data.market_cap_change_percentage_24h_usd >= 0) {
    changePercentage.classList.add('positive');
    changeWord.textContent = 'increase';
  } else {
    changePercentage.classList.add('negative');
    changeWord.textContent = 'decrease';
  }

  paragraph.appendChild(changePercentage);
  text = generateElement('span', false, ' ');
  paragraph.appendChild(text);
  paragraph.appendChild(changeWord);

  text = generateElement('span', false, ' over the last day.');
  paragraph.appendChild(text);

  description.appendChild(paragraph);
  main.appendChild(description);
}

const setMarketCap = async () => {
  const globalData = await getGlobalData();
  displayMarketCap(globalData);
}

const displayGlobalData = (globalData) => {
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
  displayGlobalData(globalData);
}

export default setFooter;
export { setMarketCap };