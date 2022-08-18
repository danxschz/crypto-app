const resetInput = () => {
  const input = document.querySelector('#search');
  input.value = '';
}

const searchCoin = async (query) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`, { mode: 'cors' });
  const json = await response.json();
  return json;
}

export default searchCoin;
export { resetInput };
