
var express = require('express'),
http = require('http'),
mongo = require('mongodb');


var app  = express(),

db = new mongo.Db('finalDb', new mongo.Server('127.0.0.1',27017,{ auto_reconnect : true})),
todoTask = db.collection("todoTask");

var db2 = new mongo.Db('UsersDb',new mongo.Server('127.0.0.1',27017,{auto_reconnect:true }));
var users = db2.collection('users');

db.open(function(err){
  console.log('connected');
});

db2.open(function(err){
  console.log('connected db2');
});

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
});
// Routes

app.get('/', function(req,res){
  todoTask.find().toArray(function(err,docs){
    if(err) throw err;
    res.render('index.jade', {todoTask : docs});
  });
});
app.post ('/', function(req,res){
  todoTask.insert({name: req.body.name}, function(err,docs){
    if(err) throw err;
    res.redirect('/');
  });
});

app.get('/update/:id', function(req,res){
  todoTask.findOne({ _id: new mongo.ObjectID(req.params.id)},function(err,docs){
    if(err)throw err;
    res.render('update.jade',{task : docs});
  });
});

app.post('/update/:id', function(req,res){
  todoTask.update(
    { _id:new mongo.ObjectID(req.params.id)},{name : req.body.name},
    function(err,item){
    if(err) throw err;
    res.redirect('/');
  });
});
app.get('/delete/:id', function(req,res){
  todoTask.remove({_id : new mongo.ObjectID(req.params.id)},function(err,docs){
    if(err) throw err;
    res.redirect('/');
  });
});



http.createServer(app).listen(3000);

