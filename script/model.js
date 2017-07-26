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
      stockViews: ["realtime_chg_percent", "Change", "MarketCapitalization"],
      stockFilter: true,
      stockArrowsBtn: false,
      stockDeleteBtn: false,
    },
    filter: {
      companyName: '',
      companyGain: '',
      rangeFrom: '',
      rangeTo: '',
    },
    stocks: {
      stockSymbolList: ["WIX", "MSFT", "AAPL, EBAY"],
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

  function getFilterMode(){
    return state.ui.stockFilter;
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
    getFilterMode
  };
})();
