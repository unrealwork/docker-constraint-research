const atsdAPI = require('atsd-api');
const request = require('request');

let options = {
  url: 'https://hbs.axibase.com:9443',
  user: 'api-reader',
  password: 'reader',
  strictSSL: false
};

let auth = 'Basic ' + new Buffer(options.user + ':' + options.password).toString('base64');

module.exports = {
  httpClient: new atsdAPI.HttpClient(options),
  request: function (url, method, payload) {
    let fullUrl = options.url + '/api' + url;
    console.log(fullUrl);
    let result = request({
      method: method,
      url: fullUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      json: payload,
      strictSSL: options.strictSSL
    });
    return result;
  },
  properties: new atsdAPI.Properties(options),
  series: new atsdAPI.Series(options),
  options: {
    url: options.url
  }
};
