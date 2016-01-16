'use strict';

const Client = require('adafruit-io/client');
const EventEmitter = require('events').EventEmitter;

module.exports = function(RED) {
  class AIOConfig extends EventEmitter {
    constructor(config) {
      super();

      RED.nodes.createNode(this, config);
      this.host = config.host || 'io.adafruit.com';
      this.port = Number(config.port) || 80;
      this.username = config.username;
      this.key = config.key;

      this.on('connected', () => {
        this.status({
          fill: 'green',
          shape: 'dot',
          text: 'connected'
        });

        this.client.feeds()
          .then(feeds => {
            this.feeds = feeds;
            this.log(`Received ${feeds.length} feeds.`);
          });
      });

      this.on('connecting', () => {
        this.status({
          fill: 'yellow',
          shape: 'dot',
          text: 'connecting'
        });
      });

      this.on('connection-error', err => {
        this.status({
          fill: 'red',
          shape: 'ring',
          text: 'connection error'
        });
        this.warn(err);
      });

      this.on('disconnected', () => {
        this.status({
          fill: 'red',
          shape: 'ring',
          text: 'disconnected'
        });
      });

      this.emit('disconnected');
      this.connect();
    }

    connect() {
      if (!this.username) {
        this.warn('AIO username must be set');
        return;
      }

      if (!this.key) {
        this.warn('AIO key must be set');
        return;
      }

      this.emit('connecting');

      this.client = new Client(this.username, this.key, {
        host: this.host,
        port: this.port,
        success: () => {
          this.emit('connected');
        },
        failure: err => {
          this.emit('connection-error', err);
        }
      });
    }
  }

  RED.nodes.registerType('adafruit-io-config', AIOConfig);
};
