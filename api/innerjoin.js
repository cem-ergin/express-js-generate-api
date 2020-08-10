
var express = require('express')
var router = express.Router()
var database = require('../db')



router.get('/:table1/:table2', (req, res) => {
  let filter = req.query.filter
  let limit = req.query.limit
  let fields = req.query.fields
  let sort = req.query.sort
  let order = req.query.order
  if (sort == null) {
    sort = "t1.id"
  }
  if (order == null) {
    order = "asc"
  }
  if (filter != null) {
    if (filter.includes(',')) {
      filter = filter.replace(/,/g, ' AND ')
    }
    if (filter.includes(':')) {
      filter = filter.replace(/:/g, '=')
    }
  }
  else {
    filter = ""
  }
  let offset = req.query.offset
  if (fields == null) {
    fields = "t2.*," + "t1.*"
  }
  if (req.query.limit == null) {
    limit = 10
  }
  if (offset == null) {
    offset = 0
  }
  {
    database.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json("database connection error");
        console.log("error", err);
      } else {
        console.log(`SELECT  ${fields} FROM ${req.params.table1} AS t1 INNER JOIN ${req.params.table2} AS t2   ${filter == "" ? '' : 'WHERE ' + filter} ORDER by ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`)
        conn.query(
          `SELECT  ${fields} FROM ${req.params.table1} AS t1 INNER JOIN ${req.params.table2} AS t2   ${filter == "" ? '' : 'WHERE ' + filter} ORDER by ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`,
          (errUserCountData, userCountData) => {
            if (errUserCountData) {
              conn.release();
              res.status(400);
              res.json({
                status: "errordata",
                message: `${errUserCountData}`
              });
            } else if (userCountData.length != 0) {
              res.status(200);

              res.json({
                // status: "success",
                // message: `${filter == '' ? 'You have to use foreign keys with ?filter ' : 'done'}`,
                count: userCountData.length,
                body: userCountData
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




