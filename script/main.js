// (function () {
//   'use strict';
//
//   // import view and model
//   const model = window.STOKR.model;
//   const view = window.STOKR.view;
//
//
//
//
//
//   // ------ Event Handlers -------
//   function setupEvents() {
//     const mainContainer = document.querySelector("main.main");
//
//     //add event listener for data toggle
//     mainContainer.addEventListener("click", eventToggleButtonInfoHandler);
//
//     // add event to arrows
//     mainContainer.addEventListener("click", changeStockOrderHandler);
//   }
//
//   // event handler to toggle button content %, absolut market cap
//   function eventToggleButtonInfoHandler(event) {
//     const target = event.target;
//
//     if (target.dataset.buttonType === "toggleInfo") {
//
//       view.toggleStockView();
//
//       //rerender page
//       view.renderStocksApp(model.getStockData());
//     }
//   }
//
//   // event to change stock order
//   function changeStockOrderHandler(event) {
//     const target = event.target;
//
//     if (target.dataset.buttonType === "changePosition") {
//       // pressed index number
//       const indexPressed = target.dataset.itemNumber - 1;
//       //arrow pressed up or down
//       const direction = target.dataset.direction;
//       //Index to be switched
//       const targetIndex = direction === 'up' ? (indexPressed - 1) : (indexPressed + 1);
//
//       // adjust model state
//       model.adjustStockOrder(indexPressed, targetIndex);
//
//       // re-render app
//       view.renderStocksApp(model.getStockData());
//     }
//   }
//
//   function init() {
//
//     //get stockdata from model
//     const stockData = model.getStockData();
//
//     //Initializes page with StockList
//     view.renderStocksApp(stockData);
//
//     //add even listeners
//     setupEvents();
//   }
//
//   init();
//
// })();
