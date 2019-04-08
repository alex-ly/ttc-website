var express=require('express');
var app=express();
var fs=require('fs');
var path=require('path');
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var session = require('express-session');
var uuid = require('node-uuid');
var bcrypt=require('bcrypt-nodejs');
var numeral=require('numeral');
var jwt=require('jsonwebtoken');
const expressJwt = require('express-jwt');

//app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.static('./'));

app.set('port', process.env.PORT || 3000);

app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/test');

var Schema=mongoose.Schema;

// session (parses session IDs and loads data)
app.use(session({
    genid: function(request) { return uuid.v4(); },
    resave: false,
    saveUninitialized: false,
    secret: 'apollo slackware propositional expectations'
}));
  

//Create schemas

var inquirySchema=new Schema({
    subject: String,
    username: String,
    date: String,
    body: String,
    active: Boolean,
    replies:[{
        username:String,
        comment:String,
        date:String,
        sortDate: Number,
    }],
    time: Date
}, {collection: 'inquiries'});
var Inquiry = mongoose.model('inquiry',inquirySchema);

var userSchema=new Schema({
    firstName: String,
    surname: String,
    username: String,
    type: String,
    hashPassword: String
}, {collection: 'users'});
var User=mongoose.model('user',userSchema);

var newsSchema =new Schema({
    // author: {
    //     type: Schema.ObjectId,
    //     ref: 'user'
    // },
    author: String,
    date: String,
    sortDate: Number,
    // comments:[{
    //     username:String,
    //     date:String,
    //     comment:String,
    //     sortDate: Number
    // }],
    title: String

}, {collection: 'news'});
var News=mongoose.model('article',newsSchema);

const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const daysOfWeek=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];


//Create the server 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // // Set to true if you need the website to include cookies in the requests sent
    // // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/clearInquiry',function(req,res){
    Inquiry.find({}).remove().exec();
    // User.find({}).remove().exec();
    // News.find({}).remove().exec();
    res.write('Inquiry database cleared');    
    res.end();
});

app.get('/clearUser',function(req,res){
    User.find({}).remove().exec();
    // News.find({}).remove().exec();
    res.write('User database cleared');    
    res.end();
});

app.get('/clearNews',function(req,res){
    News.find({}).remove().exec();
    res.write('News database cleared');    
    res.end();
});

app.get('/user',function(req,res){
    User.find({}).then(function(results){
        res.json(results);
    });
});

app.get('/inquiry',function(req,res){
    Inquiry.find({}).then(function(results){
        res.json(results);
    });
});

app.get('/new',function(req,res){
    News.find({}).sort('-sortDate').then(function(results){
        res.json(results);
    });
});

app.get('/latestNews',function(req,res){
    News.find({}).sort('-sortDate').limit(3).then(function(results){
        res.json(results);
    });
})


app.post('/logout',function(req,res){
    req.session.username=null;
    News.find({}).sort('-sortDate').limit(3).exec(function(e,r){
        res.render('main',{results:r});

    })
    
});

app.get('/',function(req,res){
    let username=req.session.username;
    //console.log(req.session.type);
        

    /*fs.readFile("./main.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"})
        
        if(req.session.username!=null){
            res.write(`<h2>Welcome ${req.session.username}</h2>`);
            req.session.save();
        }                 
        res.end(html);        
    });*/
    News.find({}).sort('-sortDate').limit(3).exec(function(e,r){
        if(username==null){
            res.render('main',{results:r});
        }else{
            //res.render('main',{username:`Welcome ${username}`});
            User.find({username:username}).then(function(results){
                if(results[0].type=='admin'){
                    res.render('main',{username:`Welcome ${username}`,admin:username,results:r});
                }else{
                    res.render('main',{username:`Welcome ${username}`,results:r});
                }            
            });
         
            
        }

    });

    
    
});

app.get('/map',function(req,res){
    //console.log(req.session.username);
        
    /*fs.readFile("./map.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"});
        
        if(req.session.username!=null) res.write(`<h2>Welcome ${req.session.username}</h2>`);                
                
        res.end(html);        
    });*/
    let username=req.session.username;    
    if(username==null){
        res.render('map');
    }else{
        //res.render('map',{username:`Welcome ${username}`});
        User.find({username:username}).then(function(results){
            if(results[0].type=='admin'){
                res.render('map',{username:`Welcome ${username}`,admin:username});
            }else{
                res.render('map',{username:`Welcome ${username}`});
            }            
        });
        
    }

});

app.get('/news',function(req,res){
    //console.log(req.session.username);
        
    /*fs.readFile("./news.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"});
        
        if(req.session.username!=null) res.write(`<h2>Welcome ${req.session.username}</h2>`);                
        
        res.end(html);        
    });*/
    let username=req.session.username;
    News.find({}).sort('-sortDate').exec(function(e,r){
            
        if(username==null){
            res.render('news',{results:r});
        }else{
            //res.render('news',{username:`Welcome ${username}`});
            User.find({username:username}).then(function(results){
                if(results[0].type=='admin'){
                    res.render('news',{username:`Welcome ${username}`,admin:username,results:r});
                }else{
                    res.render('news',{username:`Welcome ${username}`,results:r});
                }            
            });        
        
        }
    });
        

});

app.get('/shop',function(req,res){
    //console.log(req.session.username);
        
    /*fs.readFile("./shop.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"});
        
        if(req.session.username!=null) res.write(`<h2>Welcome ${req.session.username}</h2>`);                
        
        res.end(html);        
    });*/
    let username=req.session.username;    
    if(username==null){
        res.render('shop');
    }else{
        User.find({username:username}).then(function(results){
            if(results[0].type=='admin'){
                res.render('shop',{username:`Welcome ${username}`,admin:username});
            }else{
                res.render('shop',{username:`Welcome ${username}`});
            }            
        });
        
    }

});

app.get('/about',function(req,res){
    //console.log(req.session.username);
        
    /*fs.readFile("./about.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"});
        
        if(req.session.username!=null) res.write(`<h2>Welcome ${req.session.username}</h2>`);                
        
        res.end(html);        
    });*/
    let username=req.session.username;    
    if(username==null){
        res.render('about');
    }else{
        User.find({username:username}).then(function(results){
            if(results[0].type=='admin'){
                res.render('about',{username:`Welcome ${username}`,admin:username});
            }else{
                res.render('about',{username:`Welcome ${username}`});
            }            
        });
        
    }

});

app.get('/contact',function(req,res){
    //console.log(req.session.username);
        
    /*fs.readFile("./contact.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"});
        
        if(req.session.username!=null) res.write(`<h2>Welcome ${req.session.username}</h2>`);                
        
        res.end(html);        
    });*/
    let username=req.session.username;    
    if(username==null){
        res.render('contact');
    }else{
        res.render('contact',{username:`Welcome ${username}`});
        
    }

});

// app.get('/login',function(req,res){
    
//     /*fs.readFile("./login.html", "UTF-8", function(err, html){
//         res.writeHead(200, {"Content-Type": "text/html"})
//         res.end(html);        
//     });*/
//     res.render('login');
// });

app.get('/register',function(req,res){
    
    /*fs.readFile("./register.html", "UTF-8", function(err, html){
        res.writeHead(200, {"Content-Type": "text/html"})
        res.end(html);        
    });*/
    res.render('register');

});

app.get('/postNews',function(req,res){
    //res.render('postNews',{username:req.body.username,admin:req.body.username});
    res.render('postNews');
});

app.get('/inquiries',function(req,res){
    Inquiry.find({}).then(function(results){
        res.render('inquiries',{username:`Welcome ${req.session.username}`,admin:req.session.username,results:results});
    });

});


app.get(/.css$/,function(req,res){
    var cssPath = path.join(__dirname, req.url);
    var fileStream = fs.createReadStream(cssPath, "UTF-8");
    res.writeHead(200, {"Content-Type": "text/css"});
    fileStream.pipe(res);
});

app.get(/.jpg$/,function(req,res){
    var imgPath = path.join(__dirname, req.url);
    var imgStream = fs.createReadStream(imgPath);
    res.writeHead(200, {"Content-Type": "image/jpeg"});
    imgStream.pipe(res);
});

app.get(/.png$/,function(req,res){
    var imgPath = path.join(__dirname, req.url);
    var imgStream = fs.createReadStream(imgPath);
    res.writeHead(200, {"Content-Type": "image/png"});
    imgStream.pipe(res);
});

app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    
    User.find({username:username}).then(function(results){
        if(results.length>0 && bcrypt.compareSync(password, results[0].hashPassword)){

            
            req.session.username = username;
            News.find({}).sort('-sortDate').limit(3).exec(function(e,r){
                if(results[0].type=='admin'){
                    res.render('main',{username:`Welcome ${username}`,admin:username,results:r});
                }else{
                    res.render('main',{username:`Welcome ${username}`,results:r});
                }
            });
            
            
        }else{
            res.render('login',{msg:'Incorrect credentials'});
            
        }
    });


});

// app.get('/log',function(req,res){
//     //let url=req.url;
//     console.log(`Req: ${req.body}`);
//     // username=url.substring(url.indexOf('=')+1,url.indexOf('&'));
//     // let s=url.split('=');
//     // password=s[2];
//     // console.log(username);    
//     //console.log(url);
//     var username=req.body.username;
//     var password=req.body.password;
    
//     //User.find({username:username}).then(function(results){
//     User.findOne({username:username}).then(function(results){
//         if(!results) return res.sendStatus(401);
//         console.log(results);
        
//         //if(results.length>0 && bcrypt.compareSync(password, results[0].hashPassword)){
        
//         if(bcrypt.compareSync(password, results.hashPassword)){
            
//             //var token=jwt.sign({userID:results[0].id},'langrisser',{expiresIn:'2h'});
//             var token=jwt.sign({userID:results.id},'langrisser',{expiresIn:'2h'});
            
//             console.log(token);
            
//             res.send({token});

            
//         }else{
//             //res.render('login',{msg:'Incorrect credentials'});
//             console.log(`${username} ${password}`);
            
//             console.log("Not good");
            
//             return res.sendStatus(401);
            
//         }
//     });

// });

app.post('/log',function(req,res){
    //console.log(req.body);
    User.findOne({username: req.body.username}).then(function(user){
        if(!user) {
            return res.sendStatus(401)
        }
        else{
            if(bcrypt.compareSync(req.body.password, user.hashPassword)){
           
            
            //if(req.body.password === user.password){
                let admin=false;
                if(user.type=="Admin"){
                    admin=true;
                }
                var token = jwt.sign({userID: user.id, username:req.body.username, admin:admin}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
                res.send({token});
            }else{
                console.log("Incorrect Password");
            }
           
        }
  
     }).catch(function(err){
         console.log(err);
     })
});

app.post('/register',function(req,res){
    var username=req.body.username;
    var fname=req.body.firstName;
    var surname=req.body.surname;
    var type=req.body.type;
    //var password=req.body.password;
    var password=bcrypt.hashSync(req.body.password);
    //console.log(req.body);
    
    //res.writeHead(200, {"Content-Type": "text/html"})
            
    if (req.body.password != req.body.password2){
        console.log('passwords do not match');
        
        res.sendStatus(401);
    }else{
        // if(type=='admin'){
        //     res.render('verifyAdmin');
        // }
        var user=new User({username:username,
            firstName:fname,
            surname:surname,
            type: type,
            hashPassword: password});
            
        User.find({username:username}).then(function(results){
            //console.log(results);
            
            if(results.length>0){
                console.log('Username taken');
                //res.render('register',{msg:'Username taken'});
                res.sendStatus(401);
            }else{
                let adminPass='langrisser';
                let admin=false;
                    
                if(user.type=="Admin"){
                    

                    if(req.body.adminPass==adminPass){
                        admin=true;
                        user.save();
                        req.session.username = username;
                        req.session.type=type;
                        req.session.save();
                    
                        var token = jwt.sign({userID: user.id, username:req.body.username, admin:admin}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
                        res.send({token});
                    
                        }else{
                            console.log('incorrect admin password');
                            
                            res.sendStatus(401);
                        }
                                            
                }else{
                    user.save();
                    req.session.username = username;
                    req.session.type=type;
                    req.session.save();
                
                    var token = jwt.sign({userID: user.id, username:req.body.username, admin:admin}, 'todo-app-super-shared-secret', {expiresIn: '2h'});
                    res.send({token});
                

                }
                // if(type=='admin'){
                //     res.render('main',{username:`Welcome ${username}`,admin:username});
                // }else{
                //     res.render('main',{username:`Welcome ${username}`});
                // }
                        
            }
        });
    }    
});

//send inquiry
app.post('/sendInquiry',function(req,res){
    let subject=req.body.subject;
    let comment=req.body.content;
    //console.log(subject);
    //console.log(comment);
    //res.writeHead(200, {"Content-Type": "text/html"});
    //res.write("<a href=\"./contact\">Back</a>");            
    
    let d=new Date();

    var newComment={subject: subject,
                    username: req.body.username,
                    active:true,
                    replies:[],
                    date: `${daysOfWeek[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${numeral(d.getHours()).format('00')}:${numeral(d.getMinutes()).format('00')}`,
                    body: comment
                    };
    
    var inquiry=new Inquiry(newComment);
    console.log(inquiry);
    inquiry.save(function(e){
        if(e){
            console.log('error');
        }else{
            /*Inquiry.find({}).then(function(results){
            */
            // Inquiry.find({}).sort('time').exec(function(e,results){
            //     //console.log(results.length);
                        
            //     for(let i=0;i<results.length;i++){
            //         console.log(results[i]);
                    
            //         res.write("<h3>---------------------------------------</h3>")
            //         res.write(`<p> ${results[i].date}`)
            //         res.write("<h2> Subject: "+ results[i].subject+" </h2>");
            //         res.write("<p> Comment: "+results[i].body+"</p>");
            //         res.write("<br />");
            //         res.write("<br />");
        
            //     }                             
            //     res.end();            
            
            // });
            //res.write('<p>Inquiry sent</p>');
            //res.end();
            res.sendStatus(200);
        }         
    })


});

app.post('/postNews',function(req,res){
    
    let username=req.body.username;
    User.findOne({username:username}).then(function(result){
        let fname=result.firstName;
        let surname=result.surname;
        let d=new Date();

        let article = new News({
            author: `${fname}, ${surname}`,
            date: `${daysOfWeek[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${numeral(d.getHours()).format('00')}:${numeral(d.getMinutes()).format('00')}`,
            sortDate: parseInt(`${d.getFullYear()}${d.getMonth()}${d.getDate()}${numeral(d.getHours()).format('00')}${numeral(d.getMinutes()).format('00')}`),
            title: req.body.subject
        });
        article.save();
        News.find({}).sort('-sortDate').exec(function(e,results){
            //res.render('postNews',{username:username,admin:username,results:results});
            //res.render('postNews');
            res.sendStatus(200);
        });
    })     
    
});

app.post('/deletePost',function(req,res){
    let id=req.body._id;
    //console.log(id);
    
    // Inquiry.findByIdAndUpdate(id,function(e,r){
        
    //     if(e) res.sendStatus(500);
    //     r.active=false;

    //     console.log(r);
        
    //     res.sendStatus(200);
    // });
    Inquiry.findByIdAndUpdate(id,{$set:{active:false}},function(e){
        if(e) return res.sendStatus(500);
        return res.sendStatus(200);
    });

});

// app.post('/sendComment',function(req,res){
//     News.findById(req.body.id,function(e,r){
//         let comments=r.comments;
//         let d=new Date();
//         let comment={
//             username:req.body.username,
//             comment:req.body.comment,
//             date: `${daysOfWeek[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${numeral(d.getHours()).format('00')}:${numeral(d.getMinutes()).format('00')}`,
//             sortDate: parseInt(`${d.getFullYear()}${d.getMonth()}${d.getDate()}${numeral(d.getHours()).format('00')}${numeral(d.getMinutes()).format('00')}`)            
//         }
//         comments.splice(0,0,comment);
//         News.findByIdAndUpdate(id,{$set:{comments:comments}},function(e){
//             if(e) return res.sendStatus(500);
//             return res.sendStatus(200);
//         });
//     });

// });

app.post('/sendReply',function(req,res){
    console.log(req.body);
    
    Inquiry.findById(req.body.id,function(e,r){
        if(e) return res.sendStatus(500);
            
        console.log(r);
        
        let replies=[];
        
        if(r.replies!=null){
            replies=r.replies;
        } 
        let d=new Date();
        let reply={
            username:req.body.username,
            comment:req.body.comment,
            date: `${daysOfWeek[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} ${numeral(d.getHours()).format('00')}:${numeral(d.getMinutes()).format('00')}`,
            sortDate: parseInt(`${d.getFullYear()}${d.getMonth()}${d.getDate()}${numeral(d.getHours()).format('00')}${numeral(d.getMinutes()).format('00')}`)            
        }
        replies.splice(0,0,reply);
        Inquiry.findByIdAndUpdate(req.body.id,{$set:{replies:replies}},function(e){
            if(e) return res.sendStatus(500);
            return res.sendStatus(200);
        });
    });
});


app.post('/userInquiries',function(req,res){
    //console.log(req.body);
    
    Inquiry.find({username:req.body.username},function(e,r){
        res.json(r);
    });

});

// setup the HTTP listener
app.listen(app.get('port'), function () {
    console.log('Listening on port ' + app.get('port'))
});