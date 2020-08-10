
var express = require('express')
var router = express.Router()
var database = require('../db')



router.get('/:tableName', (req, res) => {
  let filter = req.query.filter
  let limit = req.query.limit
  let fields = req.query.fields
  let offset = req.query.offset
  let sort = req.query.sort
  let order = req.query.order
  let searchFields = req.query.searchFields
  let search = req.query.search
  let searching = ""
  if (sort == null) {
    sort = "id"
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
  if (searchFields == null && search == null) {
    searching = ""
  }
  else {
    if (searchFields.includes(',')) {
      searchFields = searchFields.replace(/,/g, ` LIKE  '%${search}%' OR `)
      searchFields += ` LIKE  '%${search}%'`
      searchFields = searchFields.replace(/"/g, '')
      if (filter != '') {
        searching = ' AND ' + searchFields
      }
      else {
        searching = 'WHERE ' + searchFields
      }
    }
    else {
      searchFields = `${searchFields} LIKE  '%${search}% `
      if (filter != '') {
        searching = ' AND ' + searchFields
      }
      else {
        searching = 'WHERE ' + searchFields
      }
    }
  }
  if (req.query.limit == null) {
    limit = 10
  }
  if (offset == null) {
    offset = 0
  }
  if (fields == null) {
    fields = "*"
  }
  {
    if (req.headers.token != null) {

      database.getConnection((err, conn) => {
        if (err) {
          res.status(500);
          res.json("database connection error");
          console.log("error", err);
        } else {
          console.log(`SELECT ${fields} FROM ${req.params.tableName}  ${filter == "" ? '' : 'WHERE ' + filter} ${searching} ORDER by ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`);
          conn.query(
            `SELECT ${fields} FROM ${req.params.tableName}  ${filter == "" ? '' : 'WHERE ' + filter} ${searching} ORDER by ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`,
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


                res.json({
                  //                status: "success",
                  count: userCountData.length,
                  body: userCountData
                })
                conn.release();
              } else {
                conn.release();
                res.status(404);
                res.json(
                  JSON.parse(
                    JSON.stringify({ count: 0, body: [] })
                  )
                );
              }
            }
          );
        }
      });
    }
    else {

      res.status(401);
      res.json(
        JSON.parse(
          JSON.stringify({ status: "error", message: `ERRORTOKEN` })
        )
      );
    }

  }

});

router.get('/:tableName/:id', (req, res) => {
  let fields = req.query.fields

  if (fields == null) {
    fields = "*"
  }
  {
    database.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json("database connection error");
        console.log("error", err);
      } else {
        conn.query(
          `SELECT ${fields} FROM ${req.params.tableName} WHERE id=${req.params.id}`,
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

              res.json({
                count: userCountData.length,
                data: userCountData
              })
              conn.release();
            } else {
              conn.release();
              res.status(404);
              res.json(
                JSON.parse(
                  JSON.stringify({
                    count: 0,
                    body: [],
                  }
                  )
                )
              );
            }
          }
        );
      }
    });
  }

});


router.get('/:tableName/:columnName/:value', (req, res) => {
  let fields = req.query.fields
  let offset = req.query.offset
  let limit = req.query.limit
  let sort = req.query.sort
  let order = req.query.order
  if (sort == null) {
    sort = "id"
  }
  if (order == null) {
    order = "asc"
  }
  if (fields == null) {
    fields = "*"
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
        conn.query(
          `SELECT ${fields} FROM ${req.params.tableName} WHERE ${req.params.columnName}=${req.params.value} ORDER by ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`,
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

              res.json({
                count: userCountData.length,
                data: userCountData
              })
              conn.release();
            } else {
              conn.release();
              res.status(404);
              res.json(
                JSON.parse(
                  JSON.stringify({
                    count: 0,
                    body: [],
                  }
                  )
                )
              );
            }
          }
        );
      }
    });
  }

});

router.post('/:tableName', (req, res) => {
  console.log(req);

  let key = Object.keys(req.body)
  let value = Object.values(req.body)
  key = key.join(',')
  value = value.join(',').replace(/,/g, '","')
  value = '"' + value + '"'

  {
    database.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json("database connection error");
        console.log("error", err);
      } else {


        conn.query(
          `INSERT INTO ${req.params.tableName} (${key}) VALUES (${value})`,
          (errUserCountData, userCountData) => {
            if (errUserCountData) {
              console.log(errUserCountData);
              console.log(errUserCountData);
              conn.release();
              res.status(400);
              res.json({
                status: "error",
                message: `${errUserCountData.sqlMessage}`
              });
            } else if (userCountData.length != 0) {
              res.status(200);

              res.json({
                id: userCountData.insertId,
              })
              conn.release();
            } else {
              conn.release();
              res.status(404);
              res.json(
                JSON.parse(
                  JSON.stringify({ status: "error", message: `${req.params.tableName} Tablosunda veri bulunamadı.` })
                )
              );
            }
          }
        );
      }
    });
  }

});

router.put('/:tableName/:id', (req, res) => {
  console.log(req);

  let value = ""
  for (const key in req.body) {
    value = value + key + ' = "' + req.body[key] + '" ,'
  }

  value = value.substring(0, value.length - 1)

  {
    database.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json("database connection error");
        console.log("error", err);
      } else {


        conn.query(
          `UPDATE ${req.params.tableName} SET ${value} WHERE id = ${req.params.id};`,
          (errUserCountData, userCountData) => {
            if (errUserCountData) {
              console.log(errUserCountData);
              console.log(errUserCountData);
              conn.release();
              res.status(400);
              res.json({
                status: "error",
                message: `${errUserCountData.sqlMessage}`
              });
            } else if (userCountData.length != 0) {
              if (userCountData.affectedRows != 0) {
                res.status(200);

                res.json({
                  result: userCountData.changedRows,
                })
                conn.release();
              }
              else {
                res.status(400);
                res.json(
                  JSON.parse(
                    JSON.stringify({
                      count: 0,
                      body: [],
                    }
                    )
                  )
                );
                conn.release();
              }
            } else {
              conn.release();
              res.status(404);
              res.json(
                JSON.parse(
                  JSON.stringify({ status: "error", message: `${req.params.tableName} Tablosunda veri bulunamadı.` })
                )
              );
            }
          }
        );
      }
    });
  }

});

router.delete('/:tableName/:id', (req, res) => {

  {
    database.getConnection((err, conn) => {
      if (err) {
        res.status(500);
        res.json("database connection error");
        console.log("error", err);
      } else {


        conn.query(
          `DELETE FROM ${req.params.tableName} WHERE ${req.query.lastId == null ? 'id = ' + req.params.id : ' id  BETWEEN ' + req.params.id + ' AND ' + req.query.lastId}`,
          (errUserCountData, userCountData) => {
            if (errUserCountData) {
              console.log(errUserCountData);
              console.log(errUserCountData);
              conn.release();
              res.status(400);
              res.json({
                status: "error",
                message: `${errUserCountData.sqlMessage}`
              });
            } else if (userCountData.length != 0) {
              if (userCountData.affectedRows != 0) {
                res.status(200);

                res.json({
                  result: userCountData.affectedRows,
                })
                conn.release();
              }
              else {
                res.status(400);
                res.json(
                  JSON.parse(
                    JSON.stringify({
                      count: 0,
                      body: [],
                    }
                    )
                  )
                );
                conn.release();
              }
            } else {
              conn.release();
              res.status(404);
              res.json(
                JSON.parse(
                  JSON.stringify({ status: "error", message: `${req.params.tableName} Tablosunda veri bulunamadı.` })
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




