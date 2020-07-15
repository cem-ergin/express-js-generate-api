const jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{


    const token = req.headers['x-access-token'] || req.body.token || req.query.token || req.headers.token
console.log(token,'girdik');

    if(token){

        jwt.verify(token,req.app.get('secretKey'), (err,decoded) =>{
            if(err){
                res.status(401)
                res.json({
                    status:'errortoken',
                    message: "Failed to Auth Token"
                })
            }
            else{

                

                req.decoded = decoded;

           
                  next()
            }


        } )

    }
    else{
        res.status(401)
        res.json({status:'notoken', message: "No Token"})
    }
}