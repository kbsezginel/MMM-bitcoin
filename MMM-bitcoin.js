'use strict';

Module.register("MMM-bitcoin", {

  result: {},
  defaults: {
      updateInterval: 60000,
      cryptoCurrency: ['BTC', 'ETH', 'LTC'],
      price: ['USD'],
      exhange: ['Coinbase']
  },

  getStyles: function() {
    return ["MMM-bitcoin.css"];
  },

  start: function() {
    this.getTickers();
    this.scheduleUpdate();
  },

  getDom: function() {
    var wrapper = document.createElement("ticker");
    wrapper.className = 'medium bright';
    wrapper.className = 'ticker';

    var data = this.result;
    var crypto = this.config.cryptoCurrency;
    var price = this.config.price;
    var exchange = this.config.exchange;
    var lastPrice = 0;
    if (data) {
      var priceElement = document.createElement("span");
      for (var i = 0; i < crypto.length; i++) {
        for (var j = 0; j < price.length; j++) {
          lastPrice = data[crypto[i]][price[j]];
          priceElement.innerHTML += crypto[i] + ' | ' + price[j] + ': ' + lastPrice + '<br>';
        }
      }
      wrapper.appendChild(priceElement);
    }
    return wrapper;
  },

  scheduleUpdate: function(delay) {
    var nextLoad = this.config.updateInterval;
    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    var self = this;
    setInterval(function() {
      self.getTickers();
    }, nextLoad);
  },

  getTickers: function () {
 //   var url = 'https://www.bitstamp.net/api/ticker_hour/';
    var url = 'https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD&e=Coinbase'
    this.sendSocketNotification('GET_TICKERS', url);
  },

  socketNotificationReceived: function(notification, payload) {
    if (notification === "TICKERS_RESULT") {
      this.result = payload;
      this.updateDom(self.config.fadeSpeed);
    }
  },

});
