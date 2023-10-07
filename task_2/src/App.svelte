<script>
  import CurrencyDrp from "./lib/CurrencyDrp.svelte";

  let lastChangedInput = null;
  let amountFrom = 0;
  let currencyFrom = "";
  let amountTo = 0;
  let currencyTo = "";

 const handleCurrencyFromChange = (event) => {
    currencyFrom = event.detail;
    convertCurrency();
  };

   const handleCurrencyToChange = (event) => {
    currencyTo = event.detail;
    convertCurrency();
  };

  const handleAmountFromInput = (event) => {
    amountFrom = event.target.value.replace(/\,/g, '.');
    const isValidInput = /^[0-9]*([.,]?[0-9]*)?$/.test(amountFrom);
    if (!isValidInput) {
      alert('введите число');
      amountFrom = 0;
    }
     lastChangedInput = 'from';
    convertCurrency();
  };

  const handleAmountToInput = (event) => {
    amountTo = event.target.value.replace(/\,/g, '.');
    const isValidInput = /^[0-9]*([.,]?[0-9]*)?$/.test(amountTo);
    if (!isValidInput) {
      alert('введите число');
      amountTo = 0;
    }
     lastChangedInput = 'to';
    convertCurrency();
  };

  const convertCurrency = async () => {

    const urlFrom = `https://v6.exchangerate-api.com/v6/1c0bc4dc3b62271f5c63fd91/latest/${currencyFrom}`;
    const urlTo = `https://v6.exchangerate-api.com/v6/1c0bc4dc3b62271f5c63fd91/latest/${currencyTo}`;

    try {
      const responseFrom = await fetch(urlFrom);
      const responseTo = await fetch(urlTo);

      const dataFrom = await responseFrom.json();
      const dataTo = await responseTo.json();

      if (dataFrom.result === "error" || dataTo.result === "error") {
        alert(dataFrom["error-type"] || dataTo["error-type"]);
        return;
      }

      const exchangeRateFrom = dataFrom.conversion_rates[currencyTo];
        const exchangeRateTo = dataTo.conversion_rates[currencyFrom];

     if (lastChangedInput === 'from' && !isNaN(amountFrom) && amountFrom !== '') {
          amountTo = (amountFrom * exchangeRateFrom).toFixed(5);
        } else if (lastChangedInput === 'to' && !isNaN(amountTo) && amountTo !== '') {
          amountFrom = (amountTo * exchangeRateTo).toFixed(5);
        }
    } catch (error) {
      console.error("Ошибка", error);
    }
  };
</script>

<style>

  main {
  width: calc(100% - 2*50px);
  }

  form {
    width: 100%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 1rem;
  }
</style>

<main>
<h1>Конвертер валют</h1>
  <form on:submit|preventDefault={convertCurrency}>
    <label>
      Значение исходной валюты:
      <input type="text" bind:value={amountFrom} on:input={handleAmountFromInput} placeholder="0.00" />
    </label>
    <label>
      Исходная валюта:
      <CurrencyDrp on:currencySelected={handleCurrencyFromChange} />
      
    </label>
    <label>
      Значение искомой валюты:
      <input type="text" bind:value={amountTo} on:input={handleAmountToInput}  placeholder="0.00" />
    </label> 
    <label>
      Искомая валюта:
      <CurrencyDrp on:currencySelected={handleCurrencyToChange} />
    </label>
  </form>

  <p>
    {amountFrom} {currencyFrom} эквивалентно {amountTo} {currencyTo}.
  </p>
</main>