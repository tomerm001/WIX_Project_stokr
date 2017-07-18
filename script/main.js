/**
 * Created by tomerm on 18/07/2017.
 */


// DATA

let stockSymbolList = [ "WIX", "MSFT", "YHOO"];

let stockData = [
  {
    "Symbol": "WIX",
    "Name": "Wix.com Ltd.",
    "Change": "0.750000",
    "PercentChange": "+1.51%",
    "LastTradePriceOnly": "76.099998"
  },
  {
    "Symbol": "MSFT",
    "Name": "Microsoft Corporation",
    "PercentChange": "-2.09%",
    "Change": "-0.850006",
    "LastTradePriceOnly": "69.620003"
  },
  {
    "Symbol": "YHOO",
    "Name": "Yahoo! Inc.",
    "Change": "0.279999",
    "PercentChange": "+1.11%",
    "LastTradePriceOnly": "50.599998"
  }
];

function clearAppContainer() {
  let container = document.getElementsByClassName("appContainer")[0];
  container.innerHTML = "";
}

function renderStockListHeader() {
  return `
    <header class="contentStrip">
        <h1>STOKR</h1>
        <div class="buttonContainer">
          <button class="headerButton buttonSearch"></button>
          <button class="headerButton buttonRefresh"></button>
          <button class="headerButton buttonFilter"></button>
          <button class="headerButton buttonSettings"></button>
        </div>
    </header>`
}

function renderStockListItem(data) {
  const { Name, Change, PercentChange, LastTradePriceOnly } = data;
  const roundedLastTradePriceOnly = parseFloat(LastTradePriceOnly).toFixed(2);

  const priceDirection = PercentChange.includes("-")? "" : "positive";

  return `
    <li class="contentStrip stockItem">
      <span class="companyTag">${Name}</span>
      <div class="stockItemRight">
         <span class="stockPrice">${roundedLastTradePriceOnly}</span>
         <button class="stockButton ${priceDirection}">${PercentChange}</button>
         <div class="stockButtonContainer">
           <button class="stockButtonArrow stockUpButton icon-arrow"></button>
           <button class="stockButtonArrow stockDownButton icon-arrow"></button>
         </div>
      </div>
    </li>
  `
}

function renderStockList(data) {
  return data.map(renderStockListItem)
}

function renderStockListContainer (data) {
  const renderedHTML = renderStockList(data).join("");

  return `
    <ul class="stockListContainer">
       ${renderedHTML}
    </ul>
  `
}

function placeStockList() {
  //clear all content from screen
  clearAppContainer();

  //datacontainer
  let dataToRender = [];

  // render stocklist header
  dataToRender.push(renderStockListHeader());

  // render stocklist
  dataToRender.push(renderStockListContainer(stockData));



  // append header to container
  let container = document.getElementsByClassName("appContainer")[0];
  container.innerHTML = dataToRender.join("");
}

function init() {
  placeStockList();
}

init();
