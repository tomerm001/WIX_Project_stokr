// ***
// MODEL
// ***

(function () {
  'use strict';

  //initialize app namespace
  window.STOKR = window.STOKR || {};

  const listeners = [];

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
  function addListener (func) {
      listeners.push(func);
  }

  function getStockSymbolList () {
    return state.stocks.stockSymbolList;
  }

  function getStocks () {
    return state.stocks;
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

  function setUiStockMode(mode) {
    state.ui.stockMode = mode;
    notifyModelChanged();
  }

  function setStockSymbolList(index, data) {
    state.stocks.stockSymbolList[index] = data;
    notifyModelChanged();
  }

  function setStockDataItem(index, data) {
    state.stocks.stockData[index] = data;
    notifyModelChanged();
  }

  function setStockData(data) {
    state.stocks.stockData = data;
    notifyModelChanged();
  }

  function setUiStockArrowsMode(mode) {
    state.ui.stockArrowsBtn = mode;
    notifyModelChanged();
  }

  function setFilterMode (mode) {
    state.ui.stockFilter = mode;
    notifyModelChanged();
  }

  function setFilterSettings(settings) {
    state.filter = settings;
    notifyModelChanged();
  }

  function notifyModelChanged() {
    listeners.forEach( item => item());
  }



  //data and methods to export
  window.STOKR.model = {
    state,
    addListener,
    getStockSymbolList,
    getStockData,
    getStocks,
    getState,
    getUiState,
    getFilterSettings,
    getFilterMode,
    setUiStockMode,
    setStockDataItem,
    setStockSymbolList,
    setUiStockArrowsMode,
    setFilterMode,
    setFilterSettings,
    setStockData
  };
})();
