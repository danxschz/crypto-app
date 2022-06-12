import moment from 'moment';
import Chart from 'chart.js/auto';
import generateElement from './generateElement';

const getCoinData = async (coinId) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, { mode: 'cors' });
  return response.json();
}

const getCoinChart = async (coinId) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`, { mode: 'cors' });
  return response.json();
}

const displayCoin = (coin, chart) => {
  document.title = `${coin.name} - Off The Grid`;
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

  const coinChartStats = generateElement('div', 'coin__chart-stats');

  const coinChartSection = generateElement('div', 'coin__chart-section');
  const coinChartTitle = generateElement('div', 'coin__chart__title', `${coin.name} Price Chart (${coin.symbol.toUpperCase()}/USD)`);
  coinChartSection.appendChild(coinChartTitle);

  const coinChart = generateElement('div', 'coin__chart'); 
  const ctx = document.createElement('canvas');
  const chartData = [];
  const labels = [];
  chart.prices.forEach((price) => {
    chartData.push(price[1]);
    labels.push(moment(price[0]).format('ddd DD MMM YYYY, HH:mm:ss'));
  })

  const data = {
    labels: labels,
    datasets: [{
      data: chartData,
      borderColor: '#21c9b8',
      fill: {
        target: 'origin',
        above: '#21c9b833', 
      },
      tension: 0.1
    }]
  };

  new Chart(ctx, {
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
          ticks: {
            // Include a dollar sign in the ticks
            callback: function(value, index, ticks) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      elements: {
        point:{
          radius: 0
        }
      },
    }
  });

  coinChart.appendChild(ctx);
  coinChartSection.appendChild(coinChart)
  coinChartStats.appendChild(coinChartSection);

  const coinStatistics = generateElement('div', 'coin__statistics');
  const coinStatisticsTitle = generateElement('div', 'coin__statistics__title', `${coin.symbol.toUpperCase()} Price Statistics`);
  coinStatistics.appendChild(coinStatisticsTitle);

  const priceStatistic = generateElement('div', 'coin__statistic');
  const priceStatisticTitle = generateElement('div', 'coin__statistic__title', `${coin.name} Price`);
  priceStatistic.appendChild(priceStatisticTitle);
  const priceStatisticValue = generateElement('div', 'coin__statistic__value', `$${coin.market_data.current_price.usd.toLocaleString(undefined, {maximumFractionDigits: 7})}`);
  priceStatistic.appendChild(priceStatisticValue);
  coinStatistics.appendChild(priceStatistic);
  let statisticSeparator = generateElement('div', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const dayLowHighStatistic = generateElement('div', 'coin__statistic');
  const dayLowHighStatisticTitle = generateElement('div', 'coin__statistic__title', '24h Low / 24h High');
  dayLowHighStatistic.appendChild(dayLowHighStatisticTitle);
  const dayLowHighStatisticValue = generateElement('div', 'coin__statistic__value', `$${coin.market_data.low_24h.usd.toLocaleString(undefined, {maximumFractionDigits: 7})} / $${coin.market_data.high_24h.usd.toLocaleString(undefined, {maximumFractionDigits: 7})}`);
  dayLowHighStatistic.appendChild(dayLowHighStatisticValue);
  coinStatistics.appendChild(dayLowHighStatistic);
  statisticSeparator = generateElement('div', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const volumeStatistic = generateElement('div', 'coin__statistic');
  const volumeStatisticTitle = generateElement('div', 'coin__statistic__title', 'Trading Volume');
  volumeStatistic.appendChild(volumeStatisticTitle);
  const volumeStatisticValue = generateElement('div', 'coin__statistic__value', `$${coin.market_data.total_volume.usd.toLocaleString()}`);
  volumeStatistic.appendChild(volumeStatisticValue);
  coinStatistics.appendChild(volumeStatistic);
  statisticSeparator = generateElement('div', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const rankStatistic = generateElement('div', 'coin__statistic');
  const rankStatisticTitle = generateElement('div', 'coin__statistic__title', 'Market Cap Rank');
  rankStatistic.appendChild(rankStatisticTitle);
  const rankStatisticValue = generateElement('div', 'coin__statistic__value', `#${coin.market_cap_rank}`);
  rankStatistic.appendChild(rankStatisticValue);
  coinStatistics.appendChild(rankStatistic);
  statisticSeparator = generateElement('div', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const marketCapStatistic = generateElement('div', 'coin__statistic');
  const marketCapStatisticTitle = generateElement('div', 'coin__statistic__title', 'Market Cap');
  marketCapStatistic.appendChild(marketCapStatisticTitle);
  const marketCapStatisticValue = generateElement('div', 'coin__statistic__value', `$${coin.market_data.market_cap.usd.toLocaleString()}`);
  marketCapStatistic.appendChild(marketCapStatisticValue);
  coinStatistics.appendChild(marketCapStatistic);
  statisticSeparator = generateElement('div', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const volumeByMarketStatistic = generateElement('div', 'coin__statistic');
  const volumeByMarketStatisticTitle = generateElement('div', 'coin__statistic__title', 'Volume / Market Cap');
  volumeByMarketStatistic.appendChild(volumeByMarketStatisticTitle);
  const volumeByMarketStatisticValue = generateElement('div', 'coin__statistic__value', `${(coin.market_data.total_volume.usd / coin.market_data.market_cap.usd).toLocaleString(undefined, {minimumFractionDigits: 5})}`);
  volumeByMarketStatistic.appendChild(volumeByMarketStatisticValue);
  coinStatistics.appendChild(volumeByMarketStatistic);
  statisticSeparator = generateElement('div', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const atlStatistic = generateElement('div', 'coin__statistic');
  const atlStatisticTitle = generateElement('div', 'coin__statistic__title', 'All-Time Low');
  atlStatistic.appendChild(atlStatisticTitle);
  const atlStatisticValueDiv = generateElement('div', 'coin__statistic__value_div');
  const atlStatisticValue = generateElement('div', 'coin__statistic__value', `$${coin.market_data.atl.usd.toLocaleString(undefined, {maximumFractionDigits: 7})}`);
  atlStatisticValueDiv.appendChild(atlStatisticValue);
  const atlStatisticDate = generateElement('div', 'coin__statistic__date', `${moment(coin.market_data.atl_date.usd).format('MMMM DD, YYYY')} (${moment(coin.market_data.atl_date.usd).fromNow()})`);
  atlStatisticValueDiv.appendChild(atlStatisticDate);
  atlStatistic.appendChild(atlStatisticValueDiv);
  coinStatistics.appendChild(atlStatistic);
  statisticSeparator = generateElement('div', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const athStatistic = generateElement('div', 'coin__statistic');
  const athStatisticTitle = generateElement('div', 'coin__statistic__title', 'All-Time High');
  athStatistic.appendChild(athStatisticTitle);
  const athStatisticValueDiv = generateElement('div', 'coin__statistic__value_div');
  const athStatisticValue = generateElement('div', 'coin__statistic__value', `$${coin.market_data.ath.usd.toLocaleString(undefined, {maximumFractionDigits: 7})}`);
  athStatisticValueDiv.appendChild(athStatisticValue);
  const athStatisticDate = generateElement('div', 'coin__statistic__date', `${moment(coin.market_data.ath_date.usd).format('MMMM DD, YYYY')} (${moment(coin.market_data.ath_date.usd).fromNow()})`);
  athStatisticValueDiv.appendChild(athStatisticDate);
  athStatistic.appendChild(athStatisticValueDiv);
  coinStatistics.appendChild(athStatistic);

  coinChartStats.appendChild(coinStatistics);
  main.appendChild(coinChartStats);
}

const setCoin = async (coinId) => {
  const coinData = await getCoinData(coinId);
  const coinChart = await getCoinChart(coinId);
  displayCoin(coinData, coinChart);
}

export default setCoin;