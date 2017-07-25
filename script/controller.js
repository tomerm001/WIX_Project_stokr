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
    const stockData = state.stocks.stockData;
    const uiState = state.ui;

    switch (appView) {
      case  'stockList':
        //Initializes page with StockList
        view.renderStocksApp(stockData, uiState);

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

  function applyFilter(filterSettings) {
    // update filter state with data
    model.state.filter = filterSettings;

    const {companyName, companyGain, rangeFrom, rangeTo} = model.getFilterSettings();
    const stockData = model.getStockData();
    const filteredData = [];


    stockData.forEach((item) => {
      let include = true;
      console.log(item);

      // check name in name and symbol
      if (!item.Name.toLowerCase().includes(companyName.toLowerCase()) && !item.Symbol.toLowerCase().includes(companyName.toLowerCase())) {
        console.log(item.Name.includes(companyName));

        include = false;
        console.log('entered name');
      }

      if (parseFloat(item.PercentChange) <= rangeFrom) {
        include = false;
        console.log('rangeFrom');
      }
      // if(parseFloat(item.PercentChange) >= rangeTo){
      //   include = false;
      //   console.log('rangeto');
      // }
      // if(companyGain === 'Gaining' && parseFloat(item.PercentChange) < 0) {
      //   include= false;
      //   console.log('gaining');
      // }
      // if(companyGain === 'Losing' && parseFloat(item.PercentChange) > 0) {
      //   include= false;
      //   console.log('losing');
      // }

      //if not false add element to new filtered array
      if (include) {
        filteredData.push(item);
      }
    });

    console.log(filteredData);

  }

  function fetchStocksAndSetState() {
    // function then(fncResolve, fncReject) {
    //   const result = fncResolve();
    //   if(result ===== 'Promise')
    //     return result;
    //   else {
    //     return Promise.resolve(result);
    //   }
    // }

    return Promise.resolve(fetch('./mocks/stocks.json')
      .then(res => res.json())
      .then(data => model.state.stocks.stockData = data));
  }


  function init() {
    //initial render (empty)
    renderView('stockList');

    //fetch data and rerender
    fetchStocksAndSetState()
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
  }
})();
