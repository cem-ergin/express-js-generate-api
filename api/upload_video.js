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

router.post('/', async (req, res) => {
    database.getConnection((err, conn) => {
        if (err) {
            res.status(500);
            res.json("database connection error");
            console.log("error", err);
        } else {
            try {
                console.log(req.body.senderId)
                if (!req.files) {
                    res.send({
                        control: false,
                        status: "error",
                        message: 'No file uploaded'
                    });
                } else {
                    // (req.files.video.size <= 2 * 1024 * 1024 * 1024)
                    if ((req.files.video.mimetype === 'video/3gpp' || req.files.video.mimetype === 'video/mp4' || req.files.video.mimetype === 'video/mpeg'
                        || req.files.video.mimetype === 'video/ogg' || req.files.video.mimetype === 'video/quicktime' || req.files.video.mimetype === 'video/webm'
                        || req.files.video.mimetype === 'video/x-m4v' || req.files.video.mimetype === 'video/ms-asf' || req.files.video.mimetype === 'video/x-ms-wmv'
                        || req.files.video.mimetype === 'video/x-msvideo')) {

                        let videoGuid = uuidv4()

                        let avatar = req.files.video;
                        let type = ''

                        if (req.files.video.mimetype === 'video/3gpp') {
                            type = ".3gpp"
                        }
                        if (req.files.video.mimetype === 'video/mp4') {
                            type = ".mp4"
                        }
                        if (req.files.video.mimetype === 'video/mpeg') {
                            type = ".mpeg"
                        }
                        if (req.files.video.mimetype === 'video/ogg') {
                            type = ".ogg"
                        }
                        if (req.files.video.mimetype === 'video/quicktime') {
                            type = ".mov"
                        }
                        if (req.files.video.mimetype === 'video/webm') {
                            type = ".webm"
                        }
                        if (req.files.video.mimetype === 'video/x-m4v') {
                            type = ".m4v"
                        }
                        if (req.files.video.mimetype === 'video/ms-asf') {
                            type = ".asf"
                        }
                        if (req.files.video.mimetype === 'video/x-ms-wmv') {
                            type = ".wmv"
                        }
                        if (req.files.video.mimetype === 'video/x-msvideo') {
                            type = ".msvideo"
                        }

                        let imagePath = ('public/videos' + '/' + videoGuid + type).toString()

                        conn.query(
                            "INSERT INTO videos (video,senderId) VALUES (?,?)",
                            [imagePath, req.body.senderId],
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
