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

let buttonState = "2";

// Clears all HTML content from appContainer
function clearAppContainer() {
  let container = document.getElementsByClassName("appContainer")[0];
  container.innerHTML = "";
}

// HTML content to render Stockist Tool Bar
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

// Render Specific Stock Item Line
function renderStockListItem(data, buttonState) {
  const { Name, Change, PercentChange, LastTradePriceOnly } = data;

  // round stockprice to two digits
  const roundedLastTradePriceOnly = parseFloat(LastTradePriceOnly).toFixed(2);

  // round Change
  const roundedChange = parseFloat(Change).toFixed(2);

  // add positive css class incase % is positive
  const priceDirection = PercentChange.includes("-")? "" : "positive";

  const buttonContent = buttonState === "1" ? PercentChange : roundedChange;

  return `
    <li class="contentStrip stockItem">
      <span class="companyTag">${Name}</span>
      <div class="stockItemRight">
         <span class="stockPrice">${roundedLastTradePriceOnly}</span>
         <button class="stockButton ${priceDirection}">${buttonContent}</button>
         <div class="stockButtonContainer">
           <button class="stockButtonArrow stockUpButton icon-arrow"></button>
           <button class="stockButtonArrow stockDownButton icon-arrow"></button>
         </div>
      </div>
    </li>
  `
}

//render stocklist section
function renderStockList(data, buttonState) {
  return data.map( (item) => {
    return renderStockListItem(item, buttonState)
  });
}

//Render Stocklist Container with Stocklist data
function renderStockListContainer (data, buttonState) {
  const renderedHTML = renderStockList(data, buttonState).join("");

  return `
    <ul class="stockListContainer">
       ${renderedHTML}
    </ul>
  `
}

function placeStockList(stockData, buttonState) {
  //clear all content from screen
  clearAppContainer();

  //datacontainer for all HTML to be rendered for stock list page
  let dataToRender = [];

  // render stocklist header
  dataToRender.push(renderStockListHeader());

  // render stocklist
  dataToRender.push(renderStockListContainer(stockData, buttonState));

  // append header to container
  let container = document.getElementsByClassName("appContainer")[0];
  container.innerHTML = dataToRender.join("");

  //add event listener
  document.getElementsByClassName("stockListContainer")[0].addEventListener("click", eventToggleButtonInfo);
}

function eventToggleButtonInfo(event) {
  const target = event.target.className;

  if(target.includes("stockButton ")) {
    buttonState = buttonState === "1" ? "2" : "1";

    //rerender page
    placeStockList(buttonState);
  }
}

function init() {
  //Initializes page with StockList
  placeStockList(stockData, buttonState);
}

init();
