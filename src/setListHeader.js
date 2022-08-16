import generateElement from 'generate-element';

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

const getGlobalData = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/global', { mode: 'cors' });
  const json = await response.json();
  return json;
}

const displayListHeader = (globalData) => {
  const { total_market_cap, market_cap_change_percentage_24h_usd } = globalData.data;

  const main = document.querySelector('main > div');
  const header = generateElement('div', 'list-header');
  const heading = generateElement('h1', false, 'Cryptocurrency Prices by Market Cap');
  header.appendChild(heading);

  const paragraph = document.createElement('p');
  let text = generateElement('span', false, 'The global crypto market cap is ');
  paragraph.appendChild(text);

  const marketCap = generateElement('strong', false, `$${abbreviateNumber(total_market_cap.usd)}`);
  paragraph.appendChild(marketCap);

  text = generateElement('span', false, ', a ');
  paragraph.appendChild(text);

  const changePercentage = generateElement('strong', false, `${market_cap_change_percentage_24h_usd.toFixed(2).replace('-', '')}% `);
  const changeWord = document.createElement('span');
  if (market_cap_change_percentage_24h_usd >= 0) {
    changePercentage.classList.add('positive');
    changeWord.textContent = 'increase';
  } else {
    changePercentage.classList.add('negative');
    changeWord.textContent = 'decrease';
  }

  paragraph.appendChild(changePercentage);
  paragraph.appendChild(changeWord);

  text = generateElement('span', false, ' over the last day.');
  paragraph.appendChild(text);

  header.appendChild(paragraph);
  main.appendChild(header);
}

const setListHeader = async () => {
  const globalData = await getGlobalData();
  displayListHeader(globalData);
}

export default setListHeader;
export { getGlobalData };
