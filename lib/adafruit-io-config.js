'use strict';

const Client = require('adafruit-io/client');

module.exports = function(RED) {
  function AIOConfig(config) {
    RED.nodes.createNode(this, config);
    this.host = n.host || 'io.adafruit.com';
    this.port = Number(n.port) || 80;
    this.username = n.username;
    this.key = n.key;

    this.status({
      fill: 'red',
      shape: 'ring',
      text: 'disconnected'
    });

    if (!this.username) {
      this.warn('AIO username must be set');
      return;
    }

    if (!this.key) {
      this.warn('AIO key must be set');
      return;
    }

    this.status({
      fill: 'yellow',
      shape: 'dot',
      text: 'connecting'
    });

    this.client = new Client(this.username, this.key, {
      host: this.host,
      port: this.port,
      success: function success() {
        this.status({
          fill: 'green',
          shape: 'dot',
          text: 'connected'
        });
      }.bind(this),
      failure: function failure(err) {
        this.status({
          fill: 'red',
          shape: 'ring',
          text: 'connection error'
        });
        this.error(err);
      }.bind(this)
    });


  }

  RED.nodes.registerType("adafruit-io-config", AIOConfig);
};
