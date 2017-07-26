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

    switch (appView) {
      case  'stockList':
        //check if filter on or off
        if(model.getFilterMode()) {
          stockData = applyFilter(stockData);
        }

        //Initializes page with StockList
        view.renderStocksApp(stockData, uiState, filter);

        break;
      case 'stocksearch':
        view.renderSearchApp(null, null);
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
    model.state.ui.stockMode = currentState;

    renderView('stockList');
  }

  function adjustStockOrder(position1, position2) {
    const state = model.getState();

    // change Stock Symbol List using temp element
    let tempDataHolder = state.stocks.stockSymbolList[position1];
    model.state.stocks.stockSymbolList[position1] = state.stocks.stockSymbolList[position2];
    model.state.stocks.stockSymbolList[position2] = tempDataHolder;

    // change Stock Symbol List using temp element
    let tempDataHolder2 = state.stocks.stockData[position1];
    model.state.stocks.stockData[position1] = state.stocks.stockData[position2];
    model.state.stocks.stockData[position2] = tempDataHolder2;

    renderView('stockList');
  }

  function toggleStockArrows() {
    const arrowState = model.getUiState().stockArrowsBtn;

    //toggle state between false and true
    model.state.ui.stockArrowsBtn = !arrowState;
  }

  function toggleStockFilter() {
    const filterState = model.getUiState().stockFilter;

    //toggle state between false and true
    model.state.ui.stockFilter = !filterState;

    // toggle stock arrows
    toggleStockArrows();

    renderView('stockList');
  }

  function updateFilterState(filterSettings) {
    // update filter state with data
    model.state.filter = filterSettings;

    renderView('stockList');
  }

  function applyFilter(stockData) {
    //get filter state from model
    const {companyName, companyGain, rangeFrom, rangeTo} = model.getFilterSettings();
    // const stockData = model.getStockData();
    const filteredData = [];

    stockData.forEach((item) => {
      let include = true;
      console.log(item);

      // check name in name and symbol
      if ( companyName !== ''
            && !item.Name.toLowerCase().includes(companyName.toLowerCase())
            && !item.Symbol.toLowerCase().includes(companyName.toLowerCase())) {
        // console.log(item.Name.includes(companyName));

        include = false;
        // console.log('entered name');
      }

      if ( (rangeFrom !== '') && Math.abs(parseFloat(item.realtime_chg_percent)) <= rangeFrom) {
        include = false;
        // console.log('rangeFrom');
      }
      if( (rangeTo !== '') && Math.abs(parseFloat(item.realtime_chg_percent)) >= rangeTo){
        include = false;
        console.log('rangeto');
      }
      if ( companyGain !== '') {
        if (companyGain === 'Gaining' && parseFloat(item.realtime_chg_percent) < 0) {
          include = false;
        }
        if(companyGain === 'Losing' && parseFloat(item.realtime_chg_percent) > 0) {
          include= false;
        }

      }
      //if not false add element to new filtered array
      if (include) {
        filteredData.push(item);
      }
    });

    return filteredData;
  }

  function fetchStocksAndSetState(source) {

    //fetch data from server or from local json file
    if(source === 'server') {
      const stockList = model.getStockList();
      const serverUrl = 'http://localhost:7000';
      const httpRequest = `${serverUrl}/quotes?q=${stockList}`;

      //fetch stock from server
      return Promise.resolve(fetch(httpRequest)
        .then(res => res.json())
        .then(data => model.state.stocks.stockData = data.query.results.quote)
      )
    } else if (source === 'local') {

      //fetch data from local json
      return Promise.resolve(fetch('./mocks/stocks.json')
        .then(res => res.json())
        .then(data => model.state.stocks.stockData = data)
      );
    }
  }


  function init() {
    //initial render (empty)
    renderView('stockList');

    //fetch data and rerender
    fetchStocksAndSetState('server')
      .then(() => renderView('stockList'));
  }

  init();

  //data and methods to export
  window.STOKR.controller = {
    toggleStockView,
    adjustStockOrder,
    toggleStockFilter,
    applyFilter,
    renderView,
    updateFilterState
  }
})();
