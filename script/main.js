(function () {
  'use strict';

// DATA

  const state = {
    ui: {
      stockMode: 1,
      stockViews: ["PercentChange", "Change"]
    },
    stocks: {
      stockSymbolList: ["WIX", "MSFT", "YHOO"],
      stockData: [
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
      ]
    }
  };

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
  function renderStockListItem(itemData, index) {
    let {Name, LastTradePriceOnly} = itemData;

    //logic to decide what logic should be included
    const buttonContent = state.ui.stockViews[state.ui.stockMode];

    //extract correct data for button
    let buttonValue;

    switch (buttonContent){
      case "Change":
          buttonValue = parseFloat(itemData[buttonContent]).toFixed(2);
        break;
      case "PercentChange":
          buttonValue = itemData[buttonContent];
        break;
      default:
        buttonValue = itemData[buttonContent];
    }

    // add positive css class incase % is positive
    const priceDirectParse = parseFloat(buttonValue);
    const priceDirection = priceDirectParse >= 0 ? "positive" : "";

    // round stockprice to two digits
    const roundedLastTradePriceOnly = parseFloat(LastTradePriceOnly).toFixed(2);

    return `
      <li data-item-number="${index + 1}" class="contentStrip stockItem">
        <span class="companyTag">${Name}</span>
        <div class="stockItemRight">
           <span class="stockPrice">${roundedLastTradePriceOnly}</span>
           <button data-button-type="toggleInfo" class="stockButton ${priceDirection}">${buttonValue}</button>
           <div class="stockButtonContainer">
             <button data-direction="up" data-item-number="${index + 1}" class="stockButtonArrow stockUpButton icon-arrow" 
             ></button>
             <button data-direction="down" data-item-number="${index + 1}" class="stockButtonArrow stockDownButton icon-arrow" ></button>
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

  function renderStocksApp(stockData) {
    //datacontainer for all HTML to be rendered for stock list page
    let dataToRender = [];

    // render stocklist header
    dataToRender.push(renderStockListHeader());

    // render stocklist
    dataToRender.push(renderStockListContainer(state.stocks.stockData));

    // append header to container
    let container = document.querySelector(".appContainer");
    container.innerHTML = dataToRender.join("");
  }


  // ------ Event Handlers -------
  function setupEvents() {
    const mainUl = document.querySelector(".stockListContainer");

    //add event listener for data toggle
    mainUl.addEventListener("click", eventToggleButtonInfoHandler);
  }

  // event handler to toggle button content %, absolut market cap
  function eventToggleButtonInfoHandler(event) {
    const target = event.target;

    console.dir(target);
    if (target.dataset.buttonType === "toggleInfo") {

      let currentState = state.ui.stockMode;
      let amountModes = state.ui.stockViews.length;

      //toggle to next mode
      currentState = currentState + 1;

      //if out of range reset to index 0
      currentState = currentState >= amountModes ? 0 : currentState;

      //update global state
      state.ui.stockMode = currentState;

      //rerender page and add event listeners
      renderStocksApp();
      setupEvents();
    }
  }

  // event to change stock order
  // function changeStockOrderHandler (event) {
  //   const target = event.target
  //   console.log(target);
  //
  // }


  function init() {
    //Initializes page with StockList
    renderStocksApp();

    //add even listeners
    setupEvents();
  }

  init();

})();
