import './normalize.css';
import './style.scss';
import moment from 'moment';
import setFooter, { setMarketCap } from './setFooter';
import setCoinList from './setCoinList';
import setCoin from './setCoin';

const clearMain = (mainClass) => {
  const main = document.querySelector('main');
  main.replaceChildren();
  main.removeAttribute('class');
  main.classList.add(mainClass);
}

const setCoinListPage = async () => {
  clearMain('main-list');
  await setMarketCap();
  await setCoinList();
  const coins = document.querySelectorAll('.coin-row');
  coins.forEach((coin) => {
    coin.addEventListener('click', () => setSingleCoinPage(coin.getAttribute('data-id')));
  });
}

const setSingleCoinPage = async (coinId) => {
  clearMain('main-single');
  await setCoin(coinId);
}

// Set header date
const date = document.querySelector('.date');
date.textContent = moment().format('dddd, MMMM Do YYYY');

// Set home
setCoinListPage();
setFooter();


