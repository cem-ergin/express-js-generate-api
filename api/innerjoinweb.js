var express = require('express')
var router = express.Router()
var database = require('../db')



router.get('/:table1/:table2', (req, res) => {
    let filter = req.query.filter
    let limit = req.query.limit
    let fields = req.query.fields
    let sort = req.query.sort
    let order = req.query.order
    let searchFields = req.query.searchFields
    let search = req.query.search
    let on = req.query.on
    let searching = ""
    if (sort == null) {
        sort = req.params.table1 + ".id"
    }
    if (order == null) {
        order = "asc"
    }
    if (filter != null) {
        if (filter.includes(',')) {
            filter = filter.replace(/,/g, ' AND ')
        }
    }
    else {
        filter = ""
    }
    let offset = req.query.offset
    if (fields == null) {
        fields = "t2.," + req.params.table1 + "."
    }
    if (req.query.limit == null) {
        limit = 10
    }
    if (offset == null) {
        offset = 0
    }
    if (on == null) {
        on = ""
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

    {
        database.getConnection((err, conn) => {
            if (err) {
                res.status(500);
                res.json("database connection error");
                console.log("error", err);
            } else {
                console.log(`SELECT  ${fields} FROM ${req.params.table1} INNER JOIN ${req.params.table2} AS t2  ${on != '' ? ' ON ' + on : ''}   ${filter == "" ? '' : 'WHERE ' + filter} ${searching}  ORDER by ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`);
                conn.query(
                    `SELECT  ${fields} FROM ${req.params.table1} INNER JOIN ${req.params.table2} AS t2 ${on != '' ? ' ON ' + on : ''}  ${filter == "" ? '' : 'WHERE ' + filter} ${searching}  ORDER by ${sort} ${order} LIMIT ${limit} OFFSET ${offset}`,
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
                                status: "success",
                                message: `${on == '' ? 'You have to use foreign keys with ?on ' : 'done'}`,
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