const jwt = require('jsonwebtoken');

var express = require('express')
var router = express.Router()
var database = require('../db')

const accessTokenSecret = 'youraccesstokensecret';

var md5 = require('md5');

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
        if (req.body.username === null || req.body.password === null) {
          conn.release();
          res.status(400);
          res.json(
            JSON.parse(
              JSON.stringify({ status: "error", message: `username and password can not be null` })
            )
          );
        } else {
          conn.query(
            `SELECT * FROM user WHERE username =  "${req.body.username}" AND PASSWORD= "${md5(req.body.password)}"`,
            (errUserCountData, userCountData) => {
              if (errUserCountData) {
                conn.release();
                res.status(400);
                res.json({
                  status: "error",
                  message: `${errUserCountData.sqlMessage}`
                });
              } else if (userCountData.length != 0) {
                res.status(200);
                const accessToken = jwt.sign({ username: userCountData[0].username, cAt: userCountData[0].createdAt }, req.app.get('secretKey'), {
                  expiresIn: 72000
                });
                res.json({
                  // status: "success",
                  token: accessToken,
                  // data: userCountData[0]
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
      }
    });
  }
});

router.post('/admin', (req, res) => {
  // Read username and password from request body
  {
    database.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json("database connection error");
        console.log("error", err);
      } else {
        console.log(req.body);
        if (req.body.username === null || req.body.password === null) {
          conn.release();
          res.status(400);
          res.json(
            JSON.parse(
              JSON.stringify({ status: "error", message: `username and password can not be null` })
            )
          );
        } else {
          conn.query(
            `SELECT * FROM user WHERE username =  "${req.body.username}" AND PASSWORD= "${md5(req.body.password)}" AND isManager=1`,
            (errUserCountData, userCountData) => {
              if (errUserCountData) {
                conn.release();
                res.status(400);
                res.json({
                  status: "error",
                  message: `${errUserCountData.sqlMessage}`
                });
              } else if (userCountData.length != 0) {
                res.status(200);
                const accessToken = jwt.sign({ username: userCountData[0].username, cAt: userCountData[0].createdAt }, req.app.get('secretKey'), {
                  expiresIn: 72000
                });
                res.json({
                  status: "success",
                  token: accessToken,
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
      }
    });
  }
});

module.exports = router