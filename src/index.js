import './styles/normalize.css';
import './styles/index.scss';
import html from './index.html';
import moment from 'moment';
import setCoinDetail from './setCoinDetail';
import setListHeader from './setListHeader';
import setCoinList from './setCoinList';
import setFooter from './setFooter';
import searchCoin, { resetInputs } from './searchCoin';

// Switching page logic
const switchMain = (mainClass) => {
  const main = document.querySelector('main > div');
  main.replaceChildren();
  main.removeAttribute('class');
  main.classList.add(mainClass);
}

const setCoinDetailPage = async (coinId) => {
  switchMain('main-detail');
  await setCoinDetail(coinId);
}

const setCoinListPage = async () => {
  switchMain('main-list');
  await setListHeader();
  await setCoinList();

  const coins = document.querySelectorAll('.coin-row');
  coins.forEach((coin) => {
    const id = coin.getAttribute('data-id');
    coin.addEventListener('click', () => setCoinDetailPage(id));
    coin.addEventListener('keypress', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      setCoinDetailPage(id);
    });
  });
}

// Set home
const date = document.querySelector('.date');
date.textContent = moment().format('dddd, MMMM Do YYYY');
setCoinListPage();
setFooter();

// Set search bar
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

const searchBtn = document.querySelector('.search__btn');
searchBtn.addEventListener('click', () => handleSearch());
