const http = require('http');
const fs = require('fs');

const configPath = '../config/config.json';
let configData = {};

// Read initial config file
fs.readFile(configPath, 'utf8', (err, data) => {
  if (err) throw err;
  configData = JSON.parse(data);
});

// Watch for changes in config file
fs.watch(configPath, (eventType, filename) => {
  if (filename) {
    console.log(`${filename} has been modified`);
    // Reload the config file
    fs.readFile(configPath, 'utf8', (err, data) => {
      if (err) throw err;
      configData = JSON.parse(data);
      // Reload the page
      http.get('http://localhost:8080', (res) => {
        console.log('Page reloaded');
      });
    });
  }
});
