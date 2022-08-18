import './styles/coinDetail.scss';
import generateElement from 'generate-element';
import moment from 'moment';
import Chart from 'chart.js/auto';

const getCoinData = async (coinId) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, { mode: 'cors' });
  const json = await response.json();
  return json;
}

const getCoinChart = async (coinId) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`, { mode: 'cors' });
  const json = await response.json();
  return json;
}

const maxDigits = { maximumFractionDigits: 7 };

const getPercentage = (current, low, high) => {
  const value = ((current - low) / (high - low)) * 100;
  const percentage = `${value.toFixed(0)}%`;
  return percentage;
}

const displayCoinDetail = (coin, chart) => {
  const { name, market_cap_rank, image, symbol, links } = coin;

  const { 
    current_price, 
    price_change_percentage_24h, 
    low_24h, 
    high_24h, 
    market_cap, 
    fully_diluted_valuation,
    total_volume,
    circulating_supply,
    max_supply,
    total_supply,
    atl,
    atl_date,
    ath,
    ath_date
  } = coin.market_data;

  const main = document.querySelector('main > div');

  const breadcrumbs = generateElement('div', 'breadcrumbs');
  const breadcrumbsLink = generateElement('a', false, 'Coins', { href: 'https://danxschz.github.io/crypto-app/' });
  breadcrumbs.appendChild(breadcrumbsLink);
  const breadcrumbsIcon = generateElement('i', 'fa-solid fa-chevron-right');
  breadcrumbs.appendChild(breadcrumbsIcon);
  const breadcrumbsValue = generateElement('span', false, name);
  breadcrumbs.appendChild(breadcrumbsValue);
  main.appendChild(breadcrumbs);

  const coinInfo = generateElement('div', 'coin__info');
  const coinInfoBasic = generateElement('div', 'coin__info__basic');

  const coinRankContent = (market_cap_rank) ? `Rank #${market_cap_rank}` : 'Rank #N/A';
  const coinRank = generateElement('div', 'coin__rank', coinRankContent);
  coinInfoBasic.appendChild(coinRank);

  const coinIdentifier = generateElement('div', 'coin__identifier');
  const coinImg = generateElement('img', false, false, { src: image.small, alt: `${name} logo` });
  coinIdentifier.appendChild(coinImg);
  const coinName = generateElement('h1', 'coin__name', name);
  coinIdentifier.appendChild(coinName);
  const coinSymbol = generateElement('div', 'coin__symbol', symbol);
  coinIdentifier.appendChild(coinSymbol);
  coinInfoBasic.appendChild(coinIdentifier);

  const coinLinks = generateElement('div', 'coin__links');

  if (links.homepage[0]) {
    const coinWebsite = generateElement('a', 'coin__link', false, { href: links.homepage[0], target: '_blank', rel: 'noferrer', 'aria-label': 'Website' });
    const coinWebsiteIcon = generateElement('i', 'fa-solid fa-link');
    coinWebsite.appendChild(coinWebsiteIcon);
    const coinWebsiteValue = generateElement('span', false, 'Website')
    coinWebsite.appendChild(coinWebsiteValue);
    coinLinks.appendChild(coinWebsite);
  }

  if (links.blockchain_site[0]) {
    const coinExplorer = generateElement('a', 'coin__link', false, { href: links.blockchain_site[0], target: '_blank', rel: 'noferrer', 'aria-label': 'Explorer' });
    const coinExplorerIcon = generateElement('i', 'fa-solid fa-magnifying-glass');
    coinExplorer.appendChild(coinExplorerIcon);
    const coinExplorerValue = generateElement('span', false, 'Explorer')
    coinExplorer.appendChild(coinExplorerValue);
    coinLinks.appendChild(coinExplorer);
  }

  let coinCommunityContent = links.official_forum_url[0] || links.subreddit_url || links.telegram_channel_identifier;
  if (coinCommunityContent) {
    if ((!links.official_forum_url[0]) && (!links.subreddit_url)) {
      coinCommunityContent = `https://t.me/${links.telegram_channel_identifier}`;
    }
    const coinCommunity = generateElement('a', 'coin__link', false, { href: coinCommunityContent, target: '_blank', rel: 'noreferrer', 'aria-label': 'Community' });
    const coinCommunityIcon = generateElement('i', 'fa-solid fa-user');
    coinCommunity.appendChild(coinCommunityIcon);
    const coinCommunityValue = generateElement('span', false, 'Community')
    coinCommunity.appendChild(coinCommunityValue);
    coinLinks.appendChild(coinCommunity);
  }

  if (links.repos_url.github[0]) {
    const coinSourceCode = generateElement('a', 'coin__link', false, { href: links.repos_url.github[0], target: '_blank', rel: 'noreferrer', 'aria-label': 'Source Code' });
    const coinSourceCodeIcon = generateElement('i', 'fa-solid fa-code');
    coinSourceCode.appendChild(coinSourceCodeIcon);
    const coinSourceCodeValue = generateElement('span', false, 'Source Code')
    coinSourceCode.appendChild(coinSourceCodeValue);
    coinLinks.appendChild(coinSourceCode);
  }

  coinInfoBasic.appendChild(coinLinks);
  coinInfo.appendChild(coinInfoBasic);

  const coinInfoPrice = generateElement('div', 'coin__info__price');

  const coinPriceTitle = generateElement('div', 'coin__price__title', `${name} Price (${symbol.toUpperCase()})`);
  coinInfoPrice.appendChild(coinPriceTitle);

  const coinPrice = generateElement('div', 'coin__price');
  const coinPriceValue = generateElement('div', 'coin__price__value', `$${current_price.usd.toLocaleString(undefined, maxDigits)}`);
  coinPrice.appendChild(coinPriceValue);

  const dayChange = generateElement('div', 'coin__price__change');
  const dayChangeIcon = document.createElement('i');

  if (price_change_percentage_24h >= 0) {
    dayChangeIcon.setAttribute('class', 'fa-solid fa-caret-up');
    dayChange.style.background = '#41d9ab';
  } else {
    dayChangeIcon.setAttribute('class', 'fa-solid fa-caret-down');
    dayChange.style.background = '#ea3943';
  }

  const dayChangeContent = (price_change_percentage_24h) ? `${price_change_percentage_24h.toFixed(2).replace('-','')}%` : '-';
  const dayChangeValue = generateElement('div', false, dayChangeContent);
  dayChange.appendChild(dayChangeIcon);
  dayChange.appendChild(dayChangeValue);
  coinPrice.appendChild(dayChange);
  coinInfoPrice.appendChild(coinPrice);

  const priceRange = generateElement('div', 'coin__price-range');

  const lowPrice = generateElement('div', 'coin__range');
  const lowPriceTitle = generateElement('div', 'coin__range__title', 'Low:');
  lowPrice.appendChild(lowPriceTitle);
  const lowPriceContent = (low_24h.usd) ? `$${low_24h.usd.toLocaleString(undefined, maxDigits)}` : '-';
  const lowPriceValue = generateElement('div', 'coin__range__value', lowPriceContent);
  lowPrice.appendChild(lowPriceValue);
  priceRange.appendChild(lowPrice);

  const priceRangeBar = generateElement('div', 'coin__range__bar');
  if (low_24h.usd && high_24h.usd) {
    const percentage = getPercentage(current_price.usd, low_24h.usd, high_24h.usd);
    priceRangeBar.style.background = `linear-gradient(to right, #21c9b8 0%, #21c9b8 ${percentage}, #e1e1e1 ${percentage}, #e1e1e1 100%)`;
  }
  priceRange.appendChild(priceRangeBar);

  const highPrice = generateElement('div', 'coin__range');
  const highPriceTitle = generateElement('div', 'coin__range__title', 'High:');
  highPrice.appendChild(highPriceTitle);
  const highPriceContent = (high_24h.usd) ? `$${high_24h.usd.toLocaleString(undefined, maxDigits)}` : '-';
  const highPriceValue = generateElement('div', 'coin__range__value', highPriceContent);
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
  const marketCapValue = generateElement('div', 'coin__indicator__value', `$${market_cap.usd.toLocaleString()}`);
  marketCapIndicator.appendChild(marketCapValue);
  marketCap.appendChild(marketCapIndicator);
  coinIndicators.appendChild(marketCap);

  const fullyDiluted = generateElement('div', 'coin__indicator-section');
  const fullyDilutedIndicator = generateElement('div', 'coin__indicator');
  const fullyDilutedTitle = generateElement('div', 'coin__indicator__title', 'Fully Diluted Valuation');
  fullyDilutedIndicator.appendChild(fullyDilutedTitle);
  const fullyDilutedContent = (fully_diluted_valuation.usd) ? `$${fully_diluted_valuation.usd.toLocaleString()}` : '-';
  const fullyDilutedValue = generateElement('div', 'coin__indicator__value', fullyDilutedContent);
  fullyDilutedIndicator.appendChild(fullyDilutedValue);
  fullyDiluted.appendChild(fullyDilutedIndicator);
  coinIndicators.appendChild(fullyDiluted);

  const volume = generateElement('div', 'coin__indicator-section');
  const volumeIndicator = generateElement('div', 'coin__indicator');
  const volumeTitle = generateElement('div', 'coin__indicator__title', '24h Volume');
  volumeIndicator.appendChild(volumeTitle);
  const volumeValue = generateElement('div', 'coin__indicator__value', `$${total_volume.usd.toLocaleString()}`);
  volumeIndicator.appendChild(volumeValue);
  volume.appendChild(volumeIndicator);

  const volumeByMarketIndicator = generateElement('div', 'coin__indicator');
  const volumeByMarketTitle = generateElement('div', 'coin__indicator__title', 'Volume / Market Cap');
  volumeByMarketIndicator.appendChild(volumeByMarketTitle);
  const volumeByMarketContent = (!(market_cap.usd === 0)) ? `${(total_volume.usd / market_cap.usd).toLocaleString(undefined, maxDigits)}` : '-';
  const volumeByMarketValue = generateElement('div', 'coin__indicator__value', volumeByMarketContent);
  volumeByMarketIndicator.appendChild(volumeByMarketValue);
  volume.appendChild(volumeByMarketIndicator);
  coinIndicators.appendChild(volume);

  const supply = generateElement('div', 'coin__indicator-section');
  const circulatingSupplyIndicator = generateElement('div', 'coin__indicator');
  const circulatingSupplyTitle = generateElement('div', 'coin__indicator__title', 'Circulating Supply');
  circulatingSupplyIndicator.appendChild(circulatingSupplyTitle);
  const circulatingSupplyValueDiv = generateElement('div', 'coin__indicator_horizontal');
  const circulatingSupplyValue = generateElement('div', 'coin__indicator__value', `${circulating_supply.toLocaleString()} ${symbol.toUpperCase()}`);
  circulatingSupplyValueDiv.appendChild(circulatingSupplyValue);
  circulatingSupplyIndicator.appendChild(circulatingSupplyValueDiv);

  const circulatingSupplyBar = generateElement('div', 'coin__supply__bar');
  if (circulating_supply && max_supply) {
    const percentage = `${((circulating_supply / max_supply) * 100).toFixed(0)}%`;
    circulatingSupplyBar.style.background = `linear-gradient(to right, #21c9b8 0%, #21c9b8 ${percentage}, #e1e1e1 ${percentage}, #e1e1e1 100%)`;
    const supplyBarPercentageElement = generateElement('div', 'coin__indicator__title', percentage);
    circulatingSupplyValueDiv.appendChild(supplyBarPercentageElement);
  }
  
  circulatingSupplyIndicator.appendChild(circulatingSupplyBar);
  supply.appendChild(circulatingSupplyIndicator);

  const totalMaxSupply = generateElement('div', 'coin__indicator');

  const totalSupplyIndicator = generateElement('div', 'coin__indicator_horizontal');
  const totalSupplyTitle = generateElement('div', 'coin__indicator__title', 'Total Supply');
  totalSupplyIndicator.appendChild(totalSupplyTitle);
  const totalSupplyContent = (total_supply) ? total_supply.toLocaleString() : '-';
  const totalSupplyValue = generateElement('div', 'coin__indicator__value', totalSupplyContent);
  totalSupplyIndicator.appendChild(totalSupplyValue);
  totalMaxSupply.appendChild(totalSupplyIndicator);

  const maxSupplyIndicator = generateElement('div', 'coin__indicator_horizontal');
  const maxSupplyTitle = generateElement('div', 'coin__indicator__title', 'Max Supply');
  maxSupplyIndicator.appendChild(maxSupplyTitle);
  const maxSupplyContent = (max_supply) ? max_supply.toLocaleString() : '-';
  const maxSupplyValue = generateElement('div', 'coin__indicator__value', maxSupplyContent);
  maxSupplyIndicator.appendChild(maxSupplyValue);
  totalMaxSupply.appendChild(maxSupplyIndicator);
  supply.appendChild(totalMaxSupply);

  coinIndicators.appendChild(supply);
  main.appendChild(coinIndicators);

  const coinChartStats = generateElement('div', 'coin__chart-stats');

  const coinChartSection = generateElement('div', 'coin__chart-section');
  const coinChartTitle = generateElement('h2', 'coin__chart__title', `${name} Price Chart (${symbol.toUpperCase()}/USD)`);
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
  const coinStatisticsTitle = generateElement('h2', 'coin__statistics__title', `${symbol.toUpperCase()} Price Statistics`);
  coinStatistics.appendChild(coinStatisticsTitle);

  const priceStatistic = generateElement('div', 'coin__statistic');
  const priceStatisticTitle = generateElement('div', 'coin__statistic__title', `${name} Price`);
  priceStatistic.appendChild(priceStatisticTitle);
  const priceStatisticValue = generateElement('div', 'coin__statistic__value', `$${current_price.usd.toLocaleString(undefined, maxDigits)}`);
  priceStatistic.appendChild(priceStatisticValue);
  coinStatistics.appendChild(priceStatistic);
  let statisticSeparator = generateElement('hr', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const dayLowHighStatistic = generateElement('div', 'coin__statistic');
  const dayLowHighStatisticTitle = generateElement('div', 'coin__statistic__title', '24h Low / 24h High');
  dayLowHighStatistic.appendChild(dayLowHighStatisticTitle);
  const dayLowHighStatisticValue = generateElement('div', 'coin__statistic__value', `${lowPriceContent} / ${highPriceContent}`);
  dayLowHighStatistic.appendChild(dayLowHighStatisticValue);
  coinStatistics.appendChild(dayLowHighStatistic);
  statisticSeparator = generateElement('hr', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const volumeStatistic = generateElement('div', 'coin__statistic');
  const volumeStatisticTitle = generateElement('div', 'coin__statistic__title', 'Trading Volume');
  volumeStatistic.appendChild(volumeStatisticTitle);
  const volumeStatisticValue = generateElement('div', 'coin__statistic__value', `$${total_volume.usd.toLocaleString()}`);
  volumeStatistic.appendChild(volumeStatisticValue);
  coinStatistics.appendChild(volumeStatistic);
  statisticSeparator = generateElement('hr', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const rankStatistic = generateElement('div', 'coin__statistic');
  const rankStatisticTitle = generateElement('div', 'coin__statistic__title', 'Market Cap Rank');
  rankStatistic.appendChild(rankStatisticTitle);
  const rankStatisticValue = generateElement('div', 'coin__statistic__value', coinRankContent);
  rankStatistic.appendChild(rankStatisticValue);
  coinStatistics.appendChild(rankStatistic);
  statisticSeparator = generateElement('hr', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const marketCapStatistic = generateElement('div', 'coin__statistic');
  const marketCapStatisticTitle = generateElement('div', 'coin__statistic__title', 'Market Cap');
  marketCapStatistic.appendChild(marketCapStatisticTitle);
  const marketCapStatisticValue = generateElement('div', 'coin__statistic__value', `$${market_cap.usd.toLocaleString()}`);
  marketCapStatistic.appendChild(marketCapStatisticValue);
  coinStatistics.appendChild(marketCapStatistic);
  statisticSeparator = generateElement('hr', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const volumeByMarketStatistic = generateElement('div', 'coin__statistic');
  const volumeByMarketStatisticTitle = generateElement('div', 'coin__statistic__title', 'Volume / Market Cap');
  volumeByMarketStatistic.appendChild(volumeByMarketStatisticTitle);
  const volumeByMarketStatisticValue = generateElement('div', 'coin__statistic__value', volumeByMarketContent);
  volumeByMarketStatistic.appendChild(volumeByMarketStatisticValue);
  coinStatistics.appendChild(volumeByMarketStatistic);
  statisticSeparator = generateElement('hr', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const atlStatistic = generateElement('div', 'coin__statistic');
  const atlStatisticTitle = generateElement('div', 'coin__statistic__title', 'All-Time Low');
  atlStatistic.appendChild(atlStatisticTitle);
  const atlStatisticValueDiv = generateElement('div', 'coin__statistic__value_div');
  const atlStatisticValue = generateElement('div', 'coin__statistic__value', `$${atl.usd.toLocaleString(undefined, maxDigits)}`);
  atlStatisticValueDiv.appendChild(atlStatisticValue);
  const atlStatisticDate = generateElement('div', 'coin__statistic__date', `${moment(atl_date.usd).format('MMMM DD, YYYY')} (${moment(atl_date.usd).fromNow()})`);
  atlStatisticValueDiv.appendChild(atlStatisticDate);
  atlStatistic.appendChild(atlStatisticValueDiv);
  coinStatistics.appendChild(atlStatistic);
  statisticSeparator = generateElement('hr', 'coin__statistics__separator');
  coinStatistics.appendChild(statisticSeparator);

  const athStatistic = generateElement('div', 'coin__statistic');
  const athStatisticTitle = generateElement('div', 'coin__statistic__title', 'All-Time High');
  athStatistic.appendChild(athStatisticTitle);
  const athStatisticValueDiv = generateElement('div', 'coin__statistic__value_div');
  const athStatisticValue = generateElement('div', 'coin__statistic__value', `$${ath.usd.toLocaleString(undefined, maxDigits)}`);
  athStatisticValueDiv.appendChild(athStatisticValue);
  const athStatisticDate = generateElement('div', 'coin__statistic__date', `${moment(ath_date.usd).format('MMMM DD, YYYY')} (${moment(ath_date.usd).fromNow()})`);
  athStatisticValueDiv.appendChild(athStatisticDate);
  athStatistic.appendChild(athStatisticValueDiv);
  coinStatistics.appendChild(athStatistic);

  coinChartStats.appendChild(coinStatistics);
  main.appendChild(coinChartStats);
}

const setCoinDetail = async (coinId) => {
  const coinData = await getCoinData(coinId);
  const coinChart = await getCoinChart(coinId);
  displayCoinDetail(coinData, coinChart);
  document.title = `${coinData.name} - Off The Grid`;
}

export default setCoinDetail;
