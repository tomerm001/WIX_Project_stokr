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
    const uiState =  state.ui;

    switch (appView) {
      case  'stockList':
        //Initializes page with StockList
        view.renderStocksApp(stockData, uiState);

        break;
      case 'stockSearch':

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
    model.state.ui.stockArrowsBtn  = !arrowState;
  }

  function toggleStockFilter(){
    const filterState = model.getUiState().stockFilter;

    //toggle state between false and true
    model.state.ui.stockFilter = !filterState;

    // toggle stock arrows
    toggleStockArrows();

    renderView('stockList');
  }





  function init() {
    renderView('stockList');
  }

  init();

  //data and methods to export
  window.STOKR.controller = {
    toggleStockView,
    adjustStockOrder,
    toggleStockFilter,
  }
})();
