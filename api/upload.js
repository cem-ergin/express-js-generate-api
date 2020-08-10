
const fileUpload = require('express-fileupload')
const jwt = require('jsonwebtoken');

var express = require('express')
var router = express.Router()
var database = require('../db')
var fs = require('fs')

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

router.post('/:tableName', async (req, res) => {
    database.getConnection((err, conn) => {
        if (err) {
            res.status(500);
            res.json("database connection error");
            console.log("error", err);
        } else {
            try {
                if (!req.files) {
                    res.send({
                        control: false,
                        status: "error",
                        message: 'No file uploaded'
                    });
                } else {
                    console.log(req.files.image.size)
                    if ((req.files.image.size <= 2 * 1024 * 1024) && (req.files.image.mimetype === 'image/jpeg' || req.files.image.mimetype === 'image/png' || req.files.image.mimetype === 'image/jpg' || req.files.image.mimetype === 'application/pdf')) {

                        let imageGuid = uuidv4()

                        let avatar = req.files.image;
                        let type = ''

                        if (req.files.image.mimetype === 'image/jpeg') {
                            type = ".jpeg"
                        }
                        if (req.files.image.mimetype === 'image/png') {
                            type = ".png"
                        }
                        if (req.files.image.mimetype === 'image/jpg') {
                            type = ".jpg"
                        }
                        if (req.files.image.mimetype === 'application/pdf') {
                            type = ".pdf"
                        }
                        let keys = Object.keys(req.body).join(',')
                        let val = '"' + Object.values(req.body).join('","')

                        let imagePath = (`public/${req.params.tableName}` + '/' + imageGuid + type).toString()

                        conn.query(
                            `INSERT INTO ${req.params.tableName} (${req.query.type}${keys == "" ? "" : `,${keys}`}) VALUES ("${imagePath}"${val == "" ? "" : `,${val}"`})`,
                            (errData, data) => {
                                if (errData) {
                                    console.log(errData);
                                    conn.release();
                                    res.status(500);
                                    res.json({
                                        control: false,
                                        status: "error",
                                        message: "Bad Request"
                                    });
                                } else if (data == 0) {
                                    res.status(404);
                                    res.json({
                                        control: false,
                                        status: "error",
                                        message: "No Data"
                                    });
                                    conn.release();
                                    res.end();
                                } else {
                                    conn.release();
                                    res.status(200);

                                    avatar.mv(imagePath);
                                    res.json({
                                        id: data.insertId,
                                        path: imagePath,
                                        control: true,
                                        status: "success",
                                        message: "created Successfully"
                                    });
                                    res.end();
                                }
                            }
                        );
                    }
                    else {
                        conn.release();
                        res.status(500);
                        res.send({
                            control: true,
                            status: 'error',
                            message: 'Image size is too big or only allowed jpg png and jpeg'
                        });
                    }
                }
            } catch (e) {
                console.log(e)
                res.status(500).send({
                    status: '500'
                });
            }

        }

    });


});

module.exports = router