
var express = require('express')
var router = express.Router()
var database = require('../db')

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
router.post('/insertParent', (req, res) => {
    console.log(req);
    let parent = JSON.parse(req.body.parent)
    let key = Object.keys(parent)
    let value = Object.values(parent)
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
                    `INSERT INTO user (${key}) VALUES (${value})`,
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

                            // res.json({
                            //   id: userCountData.insertId,
                            // })
                            let child = JSON.parse(req.body.child)
                            child.forEach(child => {

                                console.log(child.images)
                                if (!child.images) {
                                    res.send({
                                        control: false,
                                        status: "error",
                                        message: 'No file uploaded'
                                    });
                                } else {
                                    // console.log(child.images.type)
                                    // if ( (child.images.type === 'image/jpeg' || child.images.type === 'image/png' || child.images.type === 'image/jpg')) {

                                    let imageGuid = uuidv4()

                                    let avatar = child.images;
                                    let type = '.png'

                                    // if (child.images.type === 'image/jpeg') {
                                    //     type = ".jpeg"
                                    // }
                                    // if (child.images.type === 'image/png') {
                                    //     type = ".png"
                                    // }
                                    // if (child.images.type === 'image/jpg') {
                                    //     type = ".jpg"
                                    // }

                                    let imagePath = ('public/images' + '/' + imageGuid + type).toString()

                                    conn.query(
                                        "INSERT INTO userPhoto (image) VALUES (?)",
                                        [imagePath],
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
                                                    path: imagePath,
                                                    control: true,
                                                    status: "success",
                                                    message: "created Successfully"
                                                });
                                                res.end();
                                            }
                                        }
                                    );
                                    // }
                                    // else {
                                    //     conn.release();
                                    //     res.status(500);
                                    //     res.send({
                                    //         control: true,
                                    //         status: 'error',
                                    //         message: 'Image size is too big or only allowed jpg png and jpeg'
                                    //     });
                                    // }
                                }
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

module.exports = router