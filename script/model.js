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
      stockData: []
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
