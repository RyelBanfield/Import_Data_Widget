/*
Copyright (c) 2017, ZOHO CORPORATION
License: MIT
*/
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const errorHandler = require('errorhandler');
const morgan = require('morgan');
const serveIndex = require('serve-index');
const https = require('https');
const chalk = require('chalk');

process.env.PWD = process.env.PWD || process.cwd();

const expressApp = express();
const port = 5000;

expressApp.set('port', port);
expressApp.use(morgan('dev'));
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: false }));
expressApp.use(errorHandler());

expressApp.use('/', (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  let connectSrc = '';
  let manifest = fs.readFileSync(path.join(__dirname, '..', 'plugin-manifest.json')).toString();
  manifest = JSON.parse(manifest);
  if (manifest != null && manifest.cspDomains != null && manifest.cspDomains['connect-src'] != null) {
    const connectDomains = manifest.cspDomains['connect-src'];
    if (validateDomains(connectDomains)) {
      console.log(chalk.bold.red(`${connectDomains} - found to be invalid URL(s) in connect-src`));
      next();
      return false;
    }
    connectSrc = connectDomains.join(' ');
  }
  res.setHeader('Content-Security-Policy', `connect-src https://*.zohostatic.com https://*.sigmausercontent.com ${connectSrc}`);
  next();
});

expressApp.get('/plugin-manifest.json', (req, res) => {
  res.sendfile('plugin-manifest.json');
});

expressApp.use('/app', express.static('app'));
expressApp.use('/app', serveIndex('app'));

expressApp.get('/', (req, res) => {
  res.redirect('/app');
});

const options = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

https.createServer(options, expressApp).listen(port, () => {
  console.log(chalk.green(`${'Zet running at ht' + 'tps://127.0.0.1:'}${port}`));
  console.log(chalk.bold.cyan(`Note: Please enable the host (https://127.0.0.1:${port}) in a new tab and authorize the connection by clicking Advanced->Proceed to 127.0.0.1 (unsafe).`));
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(chalk.bold.red(`${port} port is already in use`));
  }
});

function validateDomains(domainsList) {
  const invalidURLs = domainsList.filter((domain) => !isValidURL(domain));

  return invalidURLs && invalidURLs.length > 0;
}

function isValidURL(url) {
  try {
    const parsedURL = new URL(url);
    if (parsedURL.protocol !== ('http' + ':') && parsedURL.protocol !== ('https' + ':') && parsedURL.protocol !== ('wss' + ':')) {
      return false;
    }
  } catch (e) { return false; }

  return true;
}