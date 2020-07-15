const jwt = require('jsonwebtoken');

var express = require('express')
var router = express.Router()
var database = require('../db')

const accessTokenSecret = 'youraccesstokensecret';


router.post('/', (req, res) => {
    // Read username and password from request body
        {
            database.getConnection((err, conn) => {
              if (err) {
                res.status(500);
                res.json("database connection error");
                console.log("error", err);
              } else {
                  console.log(req.body);
                  
                conn.query(
                  `SELECT * FROM user WHERE username =  "${req.body.username}" AND PASSWORD= "${req.body.password}"` ,
                  (errUserCountData, userCountData) => {
                    if (errUserCountData) {
                      conn.release();
                      res.status(400);
                      res.json({
                          status : "error",
                          message :`${errUserCountData.sqlMessage}`
                      });
                    } else if (userCountData.length!=0) {
                      res.status(200);
                      const accessToken = jwt.sign({ username: userCountData[0].username,  cAt: userCountData[0].createdAt }, accessTokenSecret);
                      res.json({
                        status: "success",
                        token : accessToken,
                        data: userCountData[0]
                      })
                      conn.release();
                    } else {
                      conn.release();
                      res.status(404);
                      res.json(
                        JSON.parse(
                          JSON.stringify({ status: "error", message: `We couldnt find data in ${req.params.tableName} table.` })
                        )
                      );
                    }
                  }
                );
              }
            });
          }
    
});



  module.exports = router