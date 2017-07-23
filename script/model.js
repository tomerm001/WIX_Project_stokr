// ***
// MODEL
// ***

(function () {
  'use strict';

  //initialize app namespace
  window.STOKR = window.STOKR || {};

  //add state to model
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


  // methods
  function getStockList () {
    return state.stocks.stockSymbolList;
  }

  function getStockData () {
    return state.stocks.stockData;
  }

  function getUiStockMode() {
    return state.ui.stockMode;
  }

  function getUiStockViews() {
    return state.ui.stockViews;
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

  function adjustStockOrder(position1, position2) {
    // change Stock Symbol List using temp element
    let tempDataHolder = state.stocks.stockSymbolList[position1];
    state.stocks.stockSymbolList[position1] = state.stocks.stockSymbolList[position2];
    state.stocks.stockSymbolList[position2] = tempDataHolder;

    // change Stock Symbol List using temp element
    let tempDataHolder2 = state.stocks.stockData[position1];
    state.stocks.stockData[position1] = state.stocks.stockData[position2];
    state.stocks.stockData[position2] = tempDataHolder2;
  }


  //data and methods to export
  window.STOKR.model = {
    getStockList,
    getStockData,
    getUiStockMode,
    getUiStockViews,
    toggleStockView,
    adjustStockOrder
  };

})();
