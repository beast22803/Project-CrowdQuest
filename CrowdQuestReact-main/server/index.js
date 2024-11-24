require("dotenv").config();
const express = require("express");
const mongoose =require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const _ = require("lodash");
const app = express();

const User = require("./models/user");
const Question = require("./models/questions");
const { result } = require("lodash");

mongoose.connect("mongodb+srv://varshitmadi:beast22803@cluster0.onppigu.mongodb.net/cqDB", {useNewUrlParser: true, useUnifiedTopology: true} , console.log("Connect"));

app.use(express.json());
app.use(cors());

let user={};
var token = undefined,token2 = undefined,token3 = undefined,token4 = undefined;
const admin = new User({
    Email: "admin@gmail.com",
    UserName: "Admin",
    Password: "Admin@22803",
});
// admin.save();

function auth(req,res,next){
    if(token !== undefined){
        jwt.verify(token,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            // console.log("verified");
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        // console.log("Not verified");
        return res.send({message: "Please log in",auth: false});
    }
}
function auth2(req,res,next){
    if(token2 !== undefined){

        jwt.verify(token2,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            // console.log("verified");
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        // console.log("Not verified");
        return res.send({message: "Please log in",auth: false});
    }
}
function auth3(req,res,next){
    if(token3 !== undefined){

        jwt.verify(token3,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            // console.log("verified");
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        // console.log("Not verified");
        return res.send({message: "Please log in",auth: false});
    }
}
function auth4(req,res,next){
    if(token4 !== undefined){

        jwt.verify(token4,process.env.ACESS_TOKEN,(err,verified)=>{
            if(err) return res.status(404).send("Token not verified");
            req.user = verified;
            // console.log("verified");
            next();
        });
    } else{
        // return res.status(404).send("Need to login first, <a href='/login'>click here</a>");
        msg="You are not logged in";
        // console.log("Not verified");
        return res.send({message: "Please log in",auth: false});
    }
}

app.get("/userInfo",(req,res) => {
    console.log("1");
    res.send({ User : user});
});

app.post("/login",(req,res)=>{
    console.log(req.body);
    User.findOne({ Email: req.body.email}, (err, result) => {
        // console.log(result);
        if(result){
            if(req.body.password === result.Password ) {
                user = result;
                if(result.Role ===  "subjectexpert" && result.AppRejUser === -1){
                    res.send({message: "You are not approved by the Admin"});
                } else{
                    user=result;
                    
                    // token = jwt.sign({result} , process.env.ACESS_TOKEN);
                    if(user.Role === "subjectexpert" && user.AppRejUser === 1){
                        token2 = jwt.sign({result} , process.env.ACESS_TOKEN);
                    } else if(user.Role === "contributor"){
                        token = jwt.sign({result} , process.env.ACESS_TOKEN);
                    } else if(user.Role === "admin"){
                        token4 = jwt.sign({result} , process.env.ACESS_TOKEN);
                    } else if(user.Role === "Student"){
                        token3 = jwt.sign({result} , process.env.ACESS_TOKEN);
                    }

                    res.send({message: "Login Successfull", user: result})
                }
            } else {
                res.send({ message: "Password didn't match"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    });
});

app.post("/register",(req,res)=>{
    // console.log(req.body);
    const user = new User({
        Email: req.body.email,
        UserName: req.body.username,
        Password: req.body.password,
        Role: req.body.role,
        Subject: req.body.subject,
        AppRejUser: -1
    });
    user.save();
});

app.post("/Contributor/addQuestion",function(req,res){
    console.log(req.body);
    
    req.body.AppRej = -1;
    // console.log(req.body);
    const question = new Question(req.body);
    question.save();
});

app.get("/Contributor",auth,(req,res)=>{
    // console.log(req.body);
    console.log(user);
    Question.find({UserID: user._id},(err,result)=>{
        if(result.length !== 0){
            res.send( {message:"Found", questions: result, auth: true, user: user });
        } else{
            if(_.isEmpty(user)){
                res.send( { message: "Not logged in" });
            } else{
                res.send( { message: "Did not yet posted any questions", auth: true, user: user});
            }
        }
    });
});

app.delete("/Contributor/delete/:id",(req,res)=>{
    // console.log(req.params.id);
    Question.deleteOne({_id: req.params.id},(err)=>{
        if(err) throw err;
    });
});

app.post("/retQuestion/:id",(req,res)=>{
    // console.log(req.params.id);
    Question.findOne({_id: req.params.id},(err,result)=>{
        if(result){
            res.send({question: result});
        }
    });
});

app.post("/Contributor/updQuestion",(req,res)=>{
    const id = req.body._id;
    delete (req.body)._id;
    // console.log(req.body);
    Question.updateOne({_id: id},req.body,(err)=>{
        if(err) throw err;
    })
});

app.post("/Contributor/search",(req,res)=>{
    // console.log(req.body);
    (req.body).UserID = user._id;
    Question.find(req.body,(err,result)=>{
        if(result){
            // console.log(result);
            res.send({questions: result});
        }
    })
});

app.post("/logout",(req,res)=>{
    user={};
    token=undefined;
    token2=undefined;
    token3=undefined;
    token4=undefined;
    // console.log(user+" "+token);
});

app.get("/SubjectExpert",auth2,(req,res)=>{
    let subSearch={
        Subject: user.Subject,
        AppRej: -1
    };
    // console.log(subSearch);
    Question.find(subSearch,function(err,result){
        if(result){
            // console.log(result);
            res.send({questions: result, auth: true, user: user});
        } else{
            console.log(error);
        }
    })
});

app.post("/SubjectExpert/search",(req,res)=>{
    (req.body).AppRej = -1;
    (req.body).Subject = user.Subject;
    Question.find(req.body,(err,result)=>{
        if(result){
            res.send({questions: result});
        }
    })
})

app.post("/SubjectExpert/approve/:id",(req,res)=>{
    // console.log(req.params.id);
    Question.updateOne({_id: req.params.id},{AppRej: 1},(err)=>{
        if(err) throw err;
    });
});

app.post("/SubjectExpert/reject/:id",(req,res)=>{
    // console.log(req.params.id);
    Question.updateOne({_id: req.params.id},{AppRej: 0},(err)=>{
        if(err) throw err;
    });
});

app.get("/Student",auth3,(req,res)=>{
    Question.find({AppRej: 1},(err,result)=>{
        if(result){
            res.send({questions: result,auth: true, user: user});
        }
    })
});

app.post("/Student/search",(req,res)=>{
    // console.log(req.body);
    (req.body).AppRej = 1;
    Question.find(req.body,(err,result)=>{
        if(result){
            // console.log(result);
            res.send({questions: result});
        }
    })
});

// app.get("/admin",auth4,(req,res)=>{
//     let userSearch={
//         Role: "subjectexpert",
//         AppRejUser: -1
//     };
//     User.find(userSearch,(err,result)=>{
//         if(result){
//             // console.log(result);
//             res.send({users: result,auth: true, user: user});
//         }
//     })
// })

app.post("/admin/approve/:id",(req,res)=>{
    // console.log(req.params.id);
    User.updateOne({_id: req.params.id},{AppRejUser: 1},(err)=>{
        if(err) throw err;
    });
});

app.post("/admin/reject/:id",(req,res)=>{
    // console.log(req.params.id);
    User.updateOne({_id: req.params.id},{AppRejUser: 0},(err)=>{
        if(err) throw err;
    });
});

app.post("/admin/block/:id",(req,res)=>{
    console.log(req.params.id);
    User.updateOne({_id: req.params.id},{AppRejUser: -1},(err)=>{
        if(err) throw err;
    });
});

app.post("/forget",(req,res)=>{
    // console.log(req.body);
    User.updateOne({Email: req.body.email},{Password: req.body.password},(err)=>{
        if(err) throw err;
    })
});


app.post('/admin/delete/:id', (req, res) => {
    const userId = req.params.id;
    console.log(req.params.id);
    
    
    if(currentPage === "questionDirectory") {
        Question.findByIdAndDelete(userId, (err) => {
            if (err) {
                return res.status(500).send('Failed to delete the user.');
            }
            res.redirect('/admin');
        });
    } else {
        User.findByIdAndDelete(userId, (err) => {
            if (err) {
                return res.status(500).send('Failed to delete the user.');
            }
            res.redirect('/admin');
        });
    }
});

let currentPage = "", copy = [];

app.get("/admin", auth4, function (req, res) {
    
    res.send({
        auth: true,
        user: user,
        users: copy,
        currentPage: currentPage
    });
});

app.post('/admin/dashboard', async (req, res) => {
    currentPage = req.body.currentPage || '';
    try {
        if (currentPage === "accountRequests") {
            copy = await User.find({ Role: "subjectexpert", AppRejUser: -1 });
        } else if (currentPage === "accountDirectory") {
            copy = await User.find({});
        } else if (currentPage === "questionDirectory") {
            copy = await Question.find({});
        }

        res.send({
            user: user,
            success: true,
            message: `Data for ${currentPage} fetched successfully`,
            users: copy,
            currentPage: currentPage
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            success: false,
            message: "An error occurred while fetching data."
        });
    }
});


app.listen(3001,console.log("Server is running at port 3000"));