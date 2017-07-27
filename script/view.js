// ***
// VIEWS
// ***

(function () {
  'use strict';

  //initialize app namespace
  window.STOKR = window.STOKR || {};

  //import controller
  let cntr = window.STOKR.controller;

  // ==== PRIVATE

  // -------- General ---------


  // Update class for appContainer to match styling
  function updateAppContainerClass (classes) {
    document.querySelector('.appContainer').className = classes.join(" ");
  }



  // --------- View StockList ----------

  // HTML content to render Stockist Tool Bar
  function renderStockListHeader() {
    return `
    <header class="contentStrip">
        <h1>STOKR</h1>
        <div class="buttonContainer">
          <a href="#stocksearch" data-button-type="search" class="headerButton icon-search"></a>
          <button data-button-type="refresh" class="headerButton icon-refresh"></button>
          <button data-button-type="filter" class="headerButton icon-filter"></button>
          <button data-button-type="settings" class="headerButton icon-settings"></button>
        </div>
    </header>`
  }

  // HTML content to render filter form
  function renderStockListFilter(filter) {
    //get filter data
    const {companyName, companyGain, rangeFrom, rangeTo} = filter;

    return `
      <form class="contentStrip filter-form">
          <div class="inputs-container">
            <div class="inputs-container-section section-left">
              <div class="input-container">
                <label for="name">By Name</label>
                <input type="text" id="name" name="companyName" value="${companyName}">
              </div>
              <div class="input-container">
                <label for="gain">By Gain</label>
                <input list="gainList" id="gain" name="companyGain" value="${companyGain}">
                <datalist id="gainList">
                  <option>All</option>
                  <option>Losing</option>
                  <option>Gaining</option>
                </datalist>
              </div>
            </div>
            <div class="inputs-container-section section-right">
              <div class="input-container">
                <label for="range-from">By Range: From</label>
                <input type="number" id="range-from" name="rangeFrom" value="${rangeFrom}">
              </div>
              <div class="input-container">
                <label for="range-to">By Range: to</label>
                <input type="number" id="range-to" name="rangeTo" value="${rangeTo}">
              </div>
            </div>
          </div>
          <button data-button-type="filterApply" class="filter-apply-button">Apply</button>
        </form>`
  }

  // Render Specific Stock Item Line
  function renderStockListItem(itemData, index, dataLength, uiState) {
    let {Name, LastTradePriceOnly, Change} = itemData;

    //get UI stockmode from model
    const stockMode = uiState.stockMode;
    const stockViews = uiState.stockViews;
    const stockArrowsBtn = uiState.stockArrowsBtn;
    // const stockDeleteBtm = uiState.stockDeleteBtn;

    //logic to decide what UI content should be included for the button
    const buttonContent = stockViews[stockMode];
    let buttonValue;
    switch (buttonContent) {
      case "Change":
        buttonValue = parseFloat(itemData[buttonContent]).toFixed(2);
        break;
      case "realtime_chg_percent":
        buttonValue = `${(parseFloat(itemData[buttonContent]).toFixed(2))}%`;
        break;
      case 'MarketCapitalization':
        buttonValue = `${parseFloat(itemData[buttonContent]).toFixed(1)}B`;
        break;
      default:
        buttonValue = itemData[buttonContent];
    }

    // add positive CSS class in case % is positive
    const priceDirectParse = parseFloat(Change);
    const priceDirection = priceDirectParse >= 0 ? "positive" : "";

    // round stock price to two digits
    const roundedLastTradePriceOnly = parseFloat(LastTradePriceOnly).toFixed(2);

    //arrow key active or not
    const arrowUp = index === 0 ? "disabled" : "";
    const arrowDown = index >= (dataLength - 1) ? "disabled" : "";
    const arrowsVisibility = stockArrowsBtn ? "" : "not-visible";

    return `
      <li data-item-number="${index + 1}" class="contentStrip stockItem">
        <span class="companyTag">${Name}</span>
        <div class="stockItemRight">
           <span class="stockPrice">${roundedLastTradePriceOnly}</span>
           <button data-button-type="toggleInfo" class="stockButton ${priceDirection}">${buttonValue}</button>
           <div class="stockButtonContainer ${arrowsVisibility}">
             <button data-button-type="changePosition" data-direction="up" data-item-number="${index + 1}" 
             class="stockButtonArrow stockUpButton icon-arrow" ${arrowUp} ></button>
             <button data-button-type="changePosition" data-direction="down" data-item-number="${index + 1}" class="stockButtonArrow stockDownButton icon-arrow" ${arrowDown}></button>
           </div>
        </div>
      </li>
    `
  }

  //render stock list section
  function renderStockList(data, uiState) {
    return data.map((item, index, arr) => {
      return renderStockListItem(item, index, arr.length, uiState)
    });
  }

  //Render Stock list Container with Stocklist data
  function renderStockListContainer(data, uiState) {
    const renderedHTML = renderStockList(data, uiState).join("");

    return `
      <ul class="list-container">
         ${renderedHTML}
      </ul>
    `
  }


  // --------- View Search ----------

  // HTML content to render Stockist Tool Bar
  function renderSearchHeader() {
    return `
    <header class="contentStrip search-container">
      <input class="search-input">
      <a href="#" class="search-cancel">Cancel</a>
     </header>`
  }

  // Render Specific Stock Item Line
  function renderSearchItem(itemData, index, dataLength, uiState) {
    let {symbol, name} = itemData;

    //get UI stockmode from model

    return `
      <li class="contentStrip search-item">
        <div class="search-item-text">
          <span class="company-name">${symbol}</span>
          <span class="exchange-name">${name}</span>
        </div>
        <button data-symbol="${symbol}" class="add-button">+</button>    
      </li>
    `
  }

  //render stock list section
  function renderSearchList(data, uiState) {
    return data.map((item, index, arr) => {
      return renderSearchItem(item, index, arr.length, uiState)
    });
  }

  //Render Stock list Container with Stocklist data
  function renderSearchContainer(data, uiState) {
    const renderedHTML = renderSearchList(data, uiState).join("");

    return `
      <ul class="list-container search-items-container">
         ${renderedHTML}
      </ul>
    `
  }




 // -------- Events All

  function setupEventsStockList() {
    const mainContainer = document.querySelector("main.main");

    //add event listener for data toggle
    mainContainer.addEventListener("click", eventToggleButtonInfoHandler);

    // add event to arrows
    mainContainer.addEventListener("click", changeStockOrderHandler);

    //add events for filter button
    mainContainer.addEventListener("click", toggleFilterHandler);

    //add events for flter apply
    mainContainer.addEventListener("click", applyFilterHandler);

    //add hashchange handler
    window.addEventListener('hashchange', hashChangeHandler);

  }

  function setupEventsSearch() {
    const mainContainer = document.querySelector("main.main");

    //add event listener for data toggle
    mainContainer.addEventListener("click", updateSearchQueryHandler);
  }

  function hashChangeHandler(event) {
    let view = window.location.hash.slice(1);

    //import controller
    const cntr = window.STOKR.controller;

    if(view === "") {
      view = 'stocklist'
    }

    cntr.renderView(view);
  }



  // ------ Event Handlers StockList -------

  // event handler to toggle button content %, absolut market cap
  function eventToggleButtonInfoHandler(event) {
    const target = event.target;

    if (target.dataset.buttonType === "toggleInfo") {
      let cntr = window.STOKR.controller;
      cntr.toggleStockView();
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
      let cntr = window.STOKR.controller;
      cntr.adjustStockOrder(indexPressed, targetIndex);
    }
  }

  //event handler for filter button
  function toggleFilterHandler(event) {
    const target = event.target;

    if(target.dataset.buttonType === 'filter') {
      //import controller
      const cntr = window.STOKR.controller;
      cntr.toggleStockFilter();
    }
  }

  function applyFilterHandler(event) {
    const target = event.target;

    if(target.dataset.buttonType === 'filterApply') {

      event.preventDefault();

      // get all data from filter form
      const dataDom = document.querySelectorAll(".filter-form input");
      const filterData = { };

      dataDom.forEach((item) => {
        filterData[item.name] = item.value.trim();
      });

      //import controller
      const cntr = window.STOKR.controller;
      cntr.updateFilterState(filterData);
    }
  }


  // ------ Event Handlers Search -------

  function updateSearchQueryHandler(event) {
    const queryTerm = event.target.value;
  }






  // ==== PUBLIC

  //main render function for Stocklist page
  function renderStocksApp(stockData, uiState, filter) {
    //data container for all HTML to be rendered for stock list page
    let dataToRender = [];

    // render stocklist header
    dataToRender.push(renderStockListHeader());

    //render filter
    if(uiState.stockFilter) {
      dataToRender.push(renderStockListFilter(filter));
    }

    // render stocklist
    dataToRender.push(renderStockListContainer(stockData, uiState));

    // append header to container
    let container = document.querySelector(".appContainer");
    container.innerHTML = dataToRender.join("");

    //update appContainer class
    updateAppContainerClass(['appContainer', 'stock-list-app-container']);

    //add all events
    setupEventsStockList();
  }

  //main render function for search page
  function renderSearchApp(searchData, uiState) {
    //data container for all HTML to be rendered for stock list page
    let dataToRender = [];

    console.log(searchData);

    // render stocklist header
    dataToRender.push(renderSearchHeader());

    dataToRender.push(renderSearchContainer(searchData, uiState));

    // append header to container
    let container = document.querySelector(".appContainer");
    container.innerHTML = dataToRender.join("");

    //update appContainer class
    updateAppContainerClass(['appContainer', 'search-app-container']);

    //add all events
    setupEventsSearch();
  }


  // data and methods to export
  window.STOKR.view = {
    renderStocksApp,
    renderSearchApp,
  }
})();
