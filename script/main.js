(function () {
  'use strict';

  // import view and model
  const model = window.STOKR.model;


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
  function renderStockListItem(itemData, index) {
    let {Name, LastTradePriceOnly} = itemData;

    //get UI stockmode from model
    const stockMode = model.getUiStockMode();
    const stockViews = model.getUiStockViews();

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
    const arrowDown = index >= (model.getStockList().length - 1) ? "disabled" : "";

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

//render stocklist section
  function renderStockList(data) {
    return data.map((item, index) => {
      return renderStockListItem(item, index)
    });
  }

//Render Stocklist Container with Stocklist data
  function renderStockListContainer(data) {
    const renderedHTML = renderStockList(data).join("");

    return `
      <ul class="stockListContainer">
         ${renderedHTML}
      </ul>
    `
  }

  //main render function for Stocklist page
  function renderStocksApp() {
    //datacontainer for all HTML to be rendered for stock list page
    let dataToRender = [];

    // render stocklist header
    dataToRender.push(renderStockListHeader());

    //get stockdata from model
    const stockData = model.getStockData();

    // render stocklist
    dataToRender.push(renderStockListContainer(stockData));

    // append header to container
    let container = document.querySelector(".appContainer");
    container.innerHTML = dataToRender.join("");
  }




  // ------ Event Handlers -------
  function setupEvents() {
    const mainContainer = document.querySelector("main.main");

    //add event listener for data toggle
    mainContainer.addEventListener("click", eventToggleButtonInfoHandler);

    // add event to arrows
    mainContainer.addEventListener("click", changeStockOrderHandler);
  }

  // event handler to toggle button content %, absolut market cap
  function eventToggleButtonInfoHandler(event) {
    const target = event.target;

    if (target.dataset.buttonType === "toggleInfo") {

      model.toggleStockView();

      //rerender page
      renderStocksApp();
    }
  }

  // event to change stock order
  function changeStockOrderHandler(event) {
    const target = event.target;

    if (target.dataset.buttonType === "changePosition") {
      // pressed index number
      const indexPressed = target.dataset.itemNumber - 1;
      //arrow pressed up or down
      const direction = target.dataset.direction;
      //Index to be switched
      const targetIndex = direction === 'up' ? (indexPressed - 1) : (indexPressed + 1);

      // adjust model state
      model.adjustStockOrder(indexPressed, targetIndex);

      // rerender app
      renderStocksApp();
    }
  }

  function init() {
    //Initializes page with StockList
    renderStocksApp();

    //add even listeners
    setupEvents();
  }

  init();

})();
