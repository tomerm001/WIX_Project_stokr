// ***
// CONTROLLER
// ***

(function () {
  'use strict';

  //initialize app namespace
  window.STOKR = window.STOKR || {};

  // import view and model
  const model = window.STOKR.model;
  const view = window.STOKR.view;


  function renderView(appView) {
    const state = model.getState();
    let stockData = state.stocks.stockData;
    const uiState = state.ui;
    const filter = state.filter;
    const searchData = state.search.results.result;

    switch (appView) {
      case  'stocklist':
        //check if filter on or off
        if (model.getFilterMode()) {
          stockData = applyFilter(stockData);
        }

        //Initializes page with StockList
        view.renderStocksApp(stockData, uiState, filter);

        break;
      case 'stocksearch':
        view.renderSearchApp(searchData, null);
        break;

      default:
        alert('View is not available');
    }
  }

  function toggleStockView() {
    const state = model.getState();

    let currentState = state.ui.stockMode;
    let amountModes = state.ui.stockViews.length;

    //toggle to next mode
    currentState = currentState + 1;

    //if out of range reset to index 0
    currentState = currentState >= amountModes ? 0 : currentState;

    //update global state
    model.setUiStockMode(currentState);

    renderView('stocklist');
  }

  function adjustStockOrder(position1, position2) {
    const stocks = model.getStocks();

    // change Stock Symbol List using temp element
    let tempDataHolder = stocks.stockSymbolList[position1];
    model.setStockSymbolList(position1, stocks.stockSymbolList[position2]);
    model.setStockSymbolList(position2, tempDataHolder);

    // change Stock Symbol List using temp element
    let tempDataHolder2 = stocks.stockData[position1];
    model.setStockDataItem(position1, stocks.stockData[position2]);
    model.setStockDataItem(position2, tempDataHolder2);

    renderView('stocklist');
  }

  function toggleStockArrows() {
    const arrowState = model.getUiState().stockArrowsBtn;

    //toggle state between false and true
    model.setUiStockArrowsMode(!arrowState);
  }

  function toggleStockFilter() {
    const filterState = model.getUiState().stockFilter;

    //toggle state between false and true
    model.setFilterMode(!filterState);

    // toggle stock arrows
    toggleStockArrows();

    renderView('stocklist');
  }

  function updateFilterState(filterSettings) {
    // update filter state with data
    model.setFilterSettings(filterSettings);

    renderView('stocklist');
  }

  function applyFilter(stockData) {
    //get filter state from model
    const {companyName, companyGain, rangeFrom, rangeTo} = model.getFilterSettings();
    // const stockData = model.getStockData();
    const filteredData = [];

    stockData.forEach((item) => {
      let include = true;

      // check name in name and symbol
      if (companyName !== ''
        && !item.Name.toLowerCase().includes(companyName.toLowerCase())
        && !item.Symbol.toLowerCase().includes(companyName.toLowerCase())) {

        include = false;
      }
      if ((rangeFrom !== '') && Math.abs(parseFloat(item.realtime_chg_percent)) <= rangeFrom) {
        include = false;
      }
      if ((rangeTo !== '') && Math.abs(parseFloat(item.realtime_chg_percent)) >= rangeTo) {
        include = false;
      }
      if (companyGain !== '') {
        if (companyGain === 'Gaining' && parseFloat(item.realtime_chg_percent) < 0) {
          include = false;
        }
        if (companyGain === 'Losing' && parseFloat(item.realtime_chg_percent) > 0) {
          include = false;
        }

      }
      //if not false add element to new filtered array
      if (include) {
        filteredData.push(item);
      }
    });

    return filteredData;
  }

  function fetchStockSearch() {

    const query = model.getSearchQuery();

    const serverUrl = 'http://localhost:7000';
    const httpRequest = `${serverUrl}/search?q=${query}`;

    //fetch stock from server
    return Promise.resolve(fetch(httpRequest)
      .then(res => res.json())
      .then(data => {
        model.setSearchState(data.ResultSet.Result);
        console.log(data);
      })
    )

  }

  function fetchStocksAndSetState(source) {

    //fetch data from server or from local json file
    if (source === 'server') {
      const stockList = model.getStockSymbolList();
      const serverUrl = 'http://localhost:7000';
      const httpRequest = `${serverUrl}/quotes?q=${stockList}`;

      //fetch stock from server
      return Promise.resolve(fetch(httpRequest)
        .then(res => res.json())
        .then(data => model.setStockData(data.query.results.quote))
      )
    } else if (source === 'local') {

      //fetch data from local json
      return Promise.resolve(fetch('./mocks/stocks.json')
        .then(res => res.json())
        .then(data => model.setStockData(data))
      );
    }
  }

  function saveStateToLocalStorage() {
    //function to save local
    localStorage.setItem('stokr-state', JSON.stringify(model.getState()));
    console.log('local updated');
  }

  function loadStateFromLocalStorage() {
    const stateFromStorage = localStorage.getItem('stokr-state');

    if (stateFromStorage) {
      model.setState(JSON.parse(stateFromStorage));
    }
  }

  function init() {
    //add listeners to model
    model.addListener(saveStateToLocalStorage);

    //load from local storage
    loadStateFromLocalStorage();

    //initial render (empty)
    renderView('stocklist');

    //fetch data and rerender
    fetchStocksAndSetState('server')
      .then(() => renderView('stocklist'));
  }

  init();

  //data and methods to export
  window.STOKR.controller = {
    toggleStockView,
    adjustStockOrder,
    toggleStockFilter,
    applyFilter,
    renderView,
    updateFilterState,
    fetchStockSearch
  }
})();
