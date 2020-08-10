
var mysql = require("mysql");


// var connection = mysql.createPool({
//   host: '93.187.206.45',
//   user: 'koruhan', // USER ismini buraya giriyorsun localde çalışacaksan genel de ismi ROOT dur 
//   password: 'g6PDHyzM?',  // MYSQL e bağlanırken girilen şifre
//   database: 'anaokulu', // bağlamak istediğin database ismini buraya yaz
//   timezone: "utc",
//   charset: "utf8"
// });

var connection = mysql.createPool({
  host: '93.187.207.90',
  user: 'eralp', // USER ismini buraya giriyorsun localde çalışacaksan genel de ismi ROOT dur.
  password: 'esc4qSrs!',  // MYSQL e bağlanırken girilen şifre
  database: 'anaokuluGen', // bağlamak istediğin database ismini buraya yaz
  timezone: "utc",
  charset: "utf8"
});


module.exports = connection
