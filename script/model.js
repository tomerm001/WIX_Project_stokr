// ***
// MODEL
// ***

(function () {
  'use strict';

  //initialize app namespace
  window.STOKR = window.STOKR || {};

  //add state to model
  const state = {
    ui :{
      stockMode: 1,
      stockViews: ["PercentChange", "Change"],
      stockFilter: true,
      stockArrowsBtn: false,
      stockDeleteBtn: false,
    },
    filter: {
      companyName: null,
      companyGain: null,
      rangeFrom: null,
      rangeTo: null,
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

  function getState() {
    return state;
  }

  function getUiState() {
    return state.ui;
  }

  function getFilterSettings() {
    return state.filter;
  }

  //data and methods to export
  window.STOKR.model = {
    state,
    getStockList,
    getStockData,
    getState,
    getUiState,
    getFilterSettings,
  };
})();
