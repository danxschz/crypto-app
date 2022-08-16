import './styles/normalize.css';
import './styles/index.scss';
import html from './index.html';
import moment from 'moment';
import searchCoin, { resetInputs } from './searchCoin';
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

const handleSearch = async () => {
  const searchBar = document.querySelector('#search');
  const results = await searchCoin(searchBar.value);
  if (results.coins.length > 0) {
    resetInputs();
    setSingleCoinPage(results.coins[0].id);
  } else {
    searchBar.value = 'No results found';
    setTimeout(() => resetInputs(), 2000);
  }
}

// Set search bar
const searchBtn = document.querySelector('.search__btn');
searchBtn.addEventListener('click', () => handleSearch());

// Set header date
const date = document.querySelector('.date');
date.textContent = moment().format('dddd, MMMM Do YYYY');

// Set home
setCoinListPage();
setFooter();
