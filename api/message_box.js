const jwt = require('jsonwebtoken');

var express = require('express')
var router = express.Router()
var database = require('../db')

router.get('/:id', (req, res) => {
    {
        database.getConnection((err, conn) => {
            if (err) {
                res.status(500);
                res.json("database connection error");
                console.log("error", err);
            } else {
                conn.query(
                    `SELECT t1.*, user.name, user.lastname, user.image FROM (SELECT * FROM messages WHERE receiverId=${req.params.id} ORDER BY atDate DESC)AS t1 inner join user WHERE user.id = t1.senderId GROUP BY senderId `,
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