<script>
  import { onMount } from "svelte";

import CurrencyDrp from "./lib/CurrencyDrp.svelte";

let lastChangedInput = null;

  let amountFrom = 0;
  let currencyFrom = "";
  let amountTo = 0;
  let currencyTo = "";
  let apiKey = "";

 

 const handleCurrencyFromChange = (event) => {
    currencyFrom = event.detail;
    convertCurrency();
  };

   const handleCurrencyToChange = (event) => {
    currencyTo = event.detail;
    convertCurrency();
  };

  
  const handleAmountFromInput = (event) => {
    amountFrom = event.target.value;
     lastChangedInput = 'from';
    convertCurrency();
  };

  const handleAmountToInput = (event) => {
    amountTo = event.target.value;
     lastChangedInput = 'to';
    convertCurrency();
  };



  const convertCurrency = async () => {
     if(!apiKey) {
      apiKey = prompt("Введите ключ API");
      return
      }

    const urlFrom = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currencyFrom}`;
    const urlTo = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${currencyTo}`;

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
          amountFrom = (amountTo / exchangeRateTo).toFixed(5);
        }
    } catch (error) {
      console.error("Ошибка", error);
    }
  };
</script>

<style>

  form {
    max-width: 300px;
    margin: 0 auto;
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
  <form on:submit|preventDefault={convertCurrency}>
    <label>
      Значение исходной валюты:
      <input type="number" bind:value={amountFrom} on:input={handleAmountFromInput}  />
    </label>
    <label>
      Исходная валюта:
      <CurrencyDrp on:currencySelected={handleCurrencyFromChange} />
      
    </label>
    <label>
      Значение искомой валюты:
      <input type="number" bind:value={amountTo} on:input={handleAmountToInput} />
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