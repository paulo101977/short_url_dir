var express = require('express')
var app = express();
var validator = require('./url-validator')
var mongo = require('mongodb');
var client = mongo.MongoClient;
var Server = mongo.Server;
var Db = mongo.Db;

var port = process.env.PORT || 8080;

app.use(express.static('public'));

app.get('/' , function(request, resource){
    resource.render('index.html');
})

app.get('/:value', function(request, resource){

    //short url value
    var value = request.params.value;
    //resource.send(value)

    if(!isNaN(value) && value == parseInt(value, 10)){
        client.connect("mongodb://paulo101977:3007paulo1977@ds019076.mlab.com:19076/courserameteor" , function(err, db){
            if(err) throw err;
            var urlCollection = db.collection('urlCollection');
            
            urlCollection.findOne({id:parseInt(value, 10)} , function(err , result){
                if(err) throw err;
                
                resource.redirect(result.url)
            })
        });
    }
    else {
        //handle error
        resource.json({error:'URL Inappropriate. Try again, please.'})
    }
    
})

app.get('*:value', function(request, resource){
    
    var value = request.params.value;

    //resource.send(JSON.stringify(request.headers))
    //resource.send(JSON.stringify(request.params))
    
    if(request.params[0] && request.params.value){
        var url = request.params[0];
        url = url.indexOf('/') == 0 ? url.substring(1) : url;
        url += request.params.value;
        
        //a url
        if(validator(url)){
            //connect to db
            client.connect("mongodb://paulo101977:3007paulo1977@ds019076.mlab.com:19076/courserameteor" , function(err, db){
                var urlCollection = db.collection('urlCollection');
                
                var id = 0;
                
                var target = urlCollection.find().limit(1).sort({$natural:-1})
                    .toArray(function(err,result){
                        if(result){
                            id = result[0].id ? parseInt(result[0].id) : 0;
                            ++id;
                        } 
                        
                        urlCollection.insert({url:url , id : id} , function(err, result){
                           //resource.json(result);
                           resource.json({url: result.ops[0].url , short: result.ops[0].id}) 
                           db.close();
                        })
                });
                
            })
            //resource.send(url)
        } 
        else {
            resource.json({error:'URL Inappropriate for any result. Try again, please.'})
        }
    }
    
    
})

//otherwise
/*app.use(function(req, res){
       //res.send(404);
    //res.send('otherwise')
    res.send(JSON.stringify(req.headers))
});*/

app.listen(port)


