import './normalize.css';
import './style.scss';
import moment from 'moment';
import setCoin from './setCoin';
//import bitcoinFetch from './a';

const date = document.querySelector('.date');
date.textContent = moment().format('dddd, MMMM Do YYYY');

//setCoinList();
setIndicators();
setCoin('bitcoin');
