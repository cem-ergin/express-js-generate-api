
var http = require("http");
var express = require("express")
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var ghs = require('./api/generate')
var ij = require('./api/innerjoin')
var ijweb = require('./api/innerjoinweb')
var login = require('./api/login')
var messageBox = require('./api/message_box')
var helper = require('./api/helper')
const path = require('path')
var sql = require('./db')
var config = require('./config')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors({ origin: true, credentials: true }));
const fileUpload = require('express-fileupload')
var upload = require('./api/upload')
var uploadVideo = require('./api/upload_video')

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "YOUR-DOMAIN.TLD"); // update to match the domain you will make the request from
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.use(function (req, res, next) {
  //izinler için....//ÜÇ
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Token, token");
  res.header("Access-Control-Allow-Headers", "*");

  res.header("*");
  //res.header('Access-Control-Allow-Headers', '*,access-token, secret-key');
  res.header("Access-Control-Allow-Credentials", true);
  next();
  //Authorization,X-Requested-With,content-type, Origin, Accept, application/x-www-form-urlencoded, multipart/form-data
  //'Origin','X-Requested-With','contentType','Content-Type','Accept','Authorization'
});


app.set('secretKey', config.api_secret_key)
const verifyToken = require('./middleware/verifyToken')
// parse application/json
app.use(bodyParser.json())
app.use('/login', login)
app.use('/messageBox', messageBox)
app.use(fileUpload({
  createParentPath: true
}));
app.use('/h', helper)
app.use('/upload', verifyToken)

app.use('/upload', upload)
app.use('/uploadVideo', verifyToken)
app.use('/uploadVideo', uploadVideo)
app.use('/', verifyToken)
app.use('/', ghs)


app.use('/i/j', ij)
app.use('/i/j', verifyToken)
app.use('/i/j/w', ijweb)
app.use('/i/j/w', verifyToken)


app.get('/about', function (req, res) {
  let result = ""
  req.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
    if (err) throw err
    result = rows[0].solution
    console.log('The solution is: ', rows[0].solution)

  })

})

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var server = app.listen(3000, "192.168.192.37", function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
});
