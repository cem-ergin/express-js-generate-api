
var mysql = require("mysql");


var connection = mysql.createPool({
    host     : 'localhost',
  user     : '', // USER ismini buraya giriyorsun localde çalışacaksan genel de ismi ROOT dur.	  
  password : '',  // MYSQL e bağlanırken girilen şifre	   
  database : 'bilgiyarismasi' // bağlamak istediğin database ismini buraya yaz
  });


  module.exports = connection
