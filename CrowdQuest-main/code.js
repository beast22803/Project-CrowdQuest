require("dotenv").config();
const express = require("express");
const app=express();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require('lodash');

mongoose.connect("mongodb+srv://varshitmadi:beast22803@cluster0.onppigu.mongodb.net/cqDB", {useNewUrlParser: true, useUnifiedTopology: true}, console.log("Connected to Databse"));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const userSchema = mongoose.Schema({
    Email: {
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    UserName: {
        type:String,
        required:true,
        unique:true,
        sparse:true
    },
    Password: String,
    Role: String,
    Subject: String,
    AppRejUser: Number
});
const User = mongoose.model("users",userSchema);

const questSchema = new mongoose.Schema({
    Subject: String,
    Question: String,
    Type: String,
    Difficulty: String,
    UserID: mongoose.Schema.Types.ObjectId,
    AppRej: Number
});
const Question = mongoose.model("question",questSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
let condition = false,user = {},quest=[],search={},searchResult={},copy={},msg="";
var token = undefined, token2 = undefined, token3 = undefined, token4 = undefined;
const admin = new User({
    Email: "admin@gmail.com",
    UserName: "Admin",
    Password: "Admin@22803",
});



app.get("/",function(req,res){
    res.render("home",{Condition: condition,User: user});
});

app.get("/login",function(req,res){
    res.render("login",{Condition: condition,User: user,Message: msg});
    msg = "";
});

app.get("/register",function(req,res){
    res.render("register",{Condition: condition,User: user});
});

app.get("/forgot",function(req,res){
    res.render("forgot",{Condition: condition,User: user});
});

app.get("/contributor",auth2,function(req,res){
    Question.find({UserID: user._id},function(err,result){
        if(err) throw err;
        else{
            if(_.isEmpty(searchResult)){
                quest=result;
            } else{
                quest=searchResult;
            }
            res.render("contributor",{Condition: condition,User: user,Questions: quest});
        }
    });
});

app.get("/subjectexpert",auth,function(req,res){
    User.find({Role: "contributor"},function(err,result){
        if(err) throw err;
        else{
            copy=result;
        }
    });
    let subSearch={
        Subject: user.Subject,
        AppRej: -1
    };
    Question.find(subSearch,function(err,result){
        if(err) throw err;
        else{
            if(_.isEmpty(searchResult)){
                quest=result;
            } else{
                quest=searchResult;
            }
        }
        res.render("subjectexpert",{Condition: condition,User: user,Questions: quest,Users: copy});
    });
});

app.get("/admin",auth3,function(req,res){
    User.find({Role: "subjectexpert"},function(err,result){
        if(err) throw err;
        else{
            copy=result;
        }
        res.render("admin",{Condition: condition,User: user,Users: copy});
    });
});

app.get("/student",auth4,function(req,res){
    Question.find({AppRej: 1},function(err,result){
        if(err) throw err;
        else{
            if(_.isEmpty(searchResult)){
                quest=result;
            } else{
                quest=searchResult;
            }
            res.render("student",{Condition: condition,User: user,Questions: quest});
        }
    });
});

function auth(req,res,next){
    if(token !== undefined){
        jwt.verify(token,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        return res.redirect("/login");
    }
}

function auth2(req,res,next){
    if(token2 !== undefined){
        jwt.verify(token2,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        return res.redirect("/login");
    }
}

function auth3(req,res,next){
    if(token3 !== undefined){
        jwt.verify(token3,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        return res.redirect("/login");
    }
}

function auth4(req,res,next){
    if(token4 !== undefined){
        jwt.verify(token4,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        return res.redirect("/login");
    }
}

app.post("/login",function(req,res){
    User.findOne({Email: req.body.email},function(err,result){
        if(err) throw err;
        else{
            if(req.body.password === result.Password){
                user = result;
                condition = true;
                if(user.Role === "subjectexpert" && user.AppRejUser === 1){
                    token = jwt.sign({result} , process.env.ACESS_TOKEN);
                    res.redirect("/subjectexpert");
                } else if(user.Role === "contributor"){
                    token2 = jwt.sign({result} , process.env.ACESS_TOKEN);
                    res.redirect("/contributor");
                } else if(user.Role === "admin"){
                    token3 = jwt.sign({result} , process.env.ACESS_TOKEN);
                    res.redirect("/admin");
                } else if(user.Role === "student"){
                    token4 = jwt.sign({result} , process.env.ACESS_TOKEN);
                    res.redirect("/student");
                }
            } else{
                msg="Wrong password";
                return res.redirect("/login");
            }
        }
    });
});

app.post("/register",function(req,res){
    const user = new User({
        Email: req.body.email,
        UserName: req.body.username,
        Password: req.body.password,
        Role: req.body.role,
        Subject: req.body.subject,
        AppRejUser: -1
    });
    if(req.body.password == req.body.passwordConf && (req.body.password).match(regex)){
        user.save();
        res.redirect("login");
    }
});

app.post("/forgot",function(req,res){
    if(req.body.password === req.body.passwordConf){
        User.updateOne({Email: req.body.email},{Password: req.body.password},function(err){
            if(err) throw err;
        });
    }
});

app.post("/logoout",function(req,res){
    user = {};
    condition = false;
    searchResult={};
    copy={};
    quest={};
    token = undefined;
    token2 = undefined;
    token3 = undefined;
    token4 = undefined;
    
    res.redirect("/");
});

app.post("/contributor/addQuestion",function(req,res){
    searchResult={};
    const question = new Question({
        Subject: req.body.subject,
        Question: req.body.question,
        Type: req.body.type,
        Difficulty: req.body.difficulty,
        UserID: user._id,
        AppRej: -1
    });
    question.save();
    res.redirect("/contributor");
});

app.post("/contributor/editQuestion",function(req,res){
    searchResult={};
    Question.updateOne({_id: req.body.id},{
        Subject: req.body.subject,
        Question: req.body.question,
        Type: req.body.type,
        Difficulty: req.body.difficulty,
        AppRej: -1
    },function(err,result){
        if(err) throw err;
        else{
            res.redirect("/contributor");
        }
    });
});

app.post("/contributor/deleteQuestion",function(req,res){
    searchResult={};
    Question.deleteOne({_id: req.body.id},function(err,result){
        if(err) throw err;
        else{
            res.redirect("/contributor");
        }
    });
});

app.post("/contributor/search",function(req,res){
    search={};
    search.UserID = user._id;
    if(req.body.subject != undefined){
        search.Subject = req.body.subject;
    } if(req.body.type != undefined){
        search.Type = req.body.type;
    } if(req.body.difficulty != undefined){
        search.Difficulty = req.body.difficulty;
    }
    Question.find(search,function(err,result){
        if(err) throw err;
        else{
            searchResult=result;
            res.redirect("/contributor");
        }
    });
});

app.post("/subjectexpert/approve",function(req,res){
    Question.updateOne({_id: req.body.id},{
            AppRej: 1
        },function(err){
            if(err) throw err;
            else{ res.redirect("/subjectexpert"); }
    });
});

app.post("/subjectexpert/reject",function(req,res){
    Question.updateOne({_id: req.body.id},{
            AppRej: 0
        },function(err){
            if(err) throw err;
            else{ res.redirect("/subjectexpert"); }
    });
});

app.post("/subjectexpert/search",function(req,res){
    search={};
    search.Subject = user.Subject;
    if(req.body.type != undefined){
        search.Type = req.body.type;
    } if(req.body.difficulty != undefined){
        search.Difficulty = req.body.difficulty;
    } if(req.body.user != undefined){
        User.findOne({UserName: req.body.user},function(err,result){
            if(err) throw err;
            else{
                search.UserID = result._id;
                Question.find(search,function(err,result){
                    if(err) throw err;
                    else{
                        searchResult=result;
                        res.redirect("/subjectexpert");
                    }
                });
            }
        });
    } else{
        Question.find(search,function(err,result){
            if(err) throw err;
            else{
                searchResult=result;
                res.redirect("/subjectexpert");
            }
        });
    }
});

app.post("/admin/approve",function(req,res){
    User.updateOne({_id: req.body.id},{
            AppRejUser: 1
        },function(err){
            if(err) throw err;
            else{ res.redirect("/admin"); }
    });
})

app.post("/admin/reject",function(req,res){
    User.updateOne({_id: req.body.id},{
        AppRejUser: 0
        },function(err){
            if(err) throw err;
            else{ res.redirect("/admin"); }
    });
});

app.post("/admin/search",function(req,res){
    res.redirect("/admin");
});

app.post("/student/search",function(req,res){
    search={};
    if(req.body.subject != undefined){
        search.Subject = req.body.subject;
    } if(req.body.type != undefined){
        search.Type = req.body.type;
    } if(req.body.difficulty != undefined){
        search.Difficulty = req.body.difficulty;
    }
    search.AppRej = 1;
    Question.find(search,function(err,result){
        if(err) throw err;
        else{
            searchResult=result;
            res.redirect("/student");
        }
    });
});

app.listen(4000,console.log("Connected to Server"));
