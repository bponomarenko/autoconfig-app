var proxy = require('express-http-proxy');
var app = require('express')();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var ORIGIN = 'http://localhost:4200';

app.all('/api/*', proxy('autoconfig.backbase.com', {
  https: true,
  preserveHostHdr: true,
  intercept: function(rsp, data, req, res, callback) {

    res._headerNames = Object.assign(res._headerNames, {
      'allow-origin': 'Access-Control-Allow-Origin',
      'allow': 'Access-Control-Allow-Methods',
      'allow-headers': 'Access-Control-Allow-Headers',
      'allow-credentials': 'Access-Control-Allow-Credentials'
    });

    res._headers = Object.assign(res._headers, {
      'allow-origin': ORIGIN,
      'allow-credentials': true
    });

    if(req.method === 'OPTIONS') {
      res._headers = Object.assign(res._headers, {
        'allow-headers': req.headers['access-control-request-headers'],
      });
    }

    callback(null, data);
  }
}));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
