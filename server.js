var http = require("http");
var express = require("express")
var app = express();
var bodyParser = require("body-parser");
var ghs = require('./api/generate')
var ij = require('./api/innerjoin')
var login = require('./api/login')
var sql = require('./db')

app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use('/login',login)
app.use('/',ghs)
app.use('/i/j',ij)


  app.get('/about', function (req, res) {
      let result=""
  req.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err
    result =  rows[0].solution
    console.log('The solution is: ', rows[0].solution)

  })

  })
  app.use( bodyParser.json() );       // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
  }));
  var server = app.listen(3000, "127.0.0.1", function () {
    var host = server.address().address
    var port = server.address().port 
    console.log("Example app listening at http://%s:%s", host, port)
});
