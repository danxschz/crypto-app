const resetInputs = () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach((input) => {
    input.value = '';
  })
}

const searchCoin = async (query) => {
  const response = await fetch(`https://api.coingecko.com/api/v3/search?query=${query}`, { mode: 'cors' });
  return response.json();
}

export default searchCoin;
export { resetInputs };