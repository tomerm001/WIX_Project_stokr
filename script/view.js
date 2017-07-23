// ***
// VIEWS
// ***

(function () {
  'use strict';

  //initialize app namespace
  window.STOKR = window.STOKR || {};

  // ==== PRIVATE

  const state = {
    ui: {
      stockMode: 1,
      stockViews: ["PercentChange", "Change"]
    }
  };

  // HTML content to render Stockist Tool Bar
  function renderStockListHeader() {
    return `
    <header class="contentStrip">
        <h1>STOKR</h1>
        <div class="buttonContainer">
          <button class="headerButton icon-search"></button>
          <button class="headerButton icon-refresh"></button>
          <button class="headerButton icon-filter"></button>
          <button class="headerButton icon-settings"></button>
        </div>
    </header>`
  }

  // Render Specific Stock Item Line
  function renderStockListItem(itemData, index, dataLength) {
    let {Name, LastTradePriceOnly} = itemData;

    //get UI stockmode from model
    const stockMode = state.ui.stockMode;
    const stockViews = state.ui.stockViews;

    //logic to decide what UI content should be included for the button
    const buttonContent = stockViews[stockMode];
    let buttonValue;
    switch (buttonContent) {
      case "Change":
        buttonValue = parseFloat(itemData[buttonContent]).toFixed(2);
        break;
      case "PercentChange":
        buttonValue = itemData[buttonContent];
        break;
      default:
        buttonValue = itemData[buttonContent];
    }

    // add positive css class in case % is positive
    const priceDirectParse = parseFloat(buttonValue);
    const priceDirection = priceDirectParse >= 0 ? "positive" : "";

    // round stock price to two digits
    const roundedLastTradePriceOnly = parseFloat(LastTradePriceOnly).toFixed(2);

    //arrow key active or not
    const arrowUp = index === 0 ? "disabled" : "";
    const arrowDown = index >= (dataLength - 1) ? "disabled" : "";

    return `
      <li data-item-number="${index + 1}" class="contentStrip stockItem">
        <span class="companyTag">${Name}</span>
        <div class="stockItemRight">
           <span class="stockPrice">${roundedLastTradePriceOnly}</span>
           <button data-button-type="toggleInfo" class="stockButton ${priceDirection}">${buttonValue}</button>
           <div class="stockButtonContainer">
             <button data-button-type="changePosition" data-direction="up" data-item-number="${index + 1}" 
             class="stockButtonArrow stockUpButton icon-arrow" ${arrowUp} ></button>
             <button data-button-type="changePosition" data-direction="down" data-item-number="${index + 1}" class="stockButtonArrow stockDownButton icon-arrow" ${arrowDown}></button>
           </div>
        </div>
      </li>
    `
  }

  //render stock list section
  function renderStockList(data) {
    const dataLength = data.length;

    return data.map((item, index) => {
      return renderStockListItem(item, index, dataLength)
    });
  }

  //Render Stock list Container with Stocklist data
  function renderStockListContainer(data) {
    const renderedHTML = renderStockList(data).join("");

    return `
      <ul class="stockListContainer">
         ${renderedHTML}
      </ul>
    `
  }


  // ==== PUBLIC

  //main render function for Stocklist page
  function renderStocksApp(stockData) {
    //datacontainer for all HTML to be rendered for stock list page
    let dataToRender = [];

    // render stocklist header
    dataToRender.push(renderStockListHeader());


    // render stocklist
    dataToRender.push(renderStockListContainer(stockData));

    // append header to container
    let container = document.querySelector(".appContainer");
    container.innerHTML = dataToRender.join("");
  }

  function toggleStockView() {
    let currentState = state.ui.stockMode;
    let amountModes = state.ui.stockViews.length;

    //toggle to next mode
    currentState = currentState + 1;

    //if out of range reset to index 0
    currentState = currentState >= amountModes ? 0 : currentState;

    //update global state
    state.ui.stockMode = currentState;
  }



  // data and methods to export
  window.STOKR.view = {
    renderStocksApp,
    toggleStockView,
  }
})();
