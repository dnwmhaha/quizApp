const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverrid = require("method-override");
const expressSanitizer = require("express-sanitizer");
const fs = require('fs');
const PORT = process.env.PORT || 3000;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoURI = "mongodb+srv://aisenkim15:aisen0426@cluster0-mbof3.mongodb.net/ThinkPrep?retryWrites=true";
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((error) => {
    console.log(error);
});
//local usage
// mongoose.connect("mongodb://localhost/quiz_app", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

app.use(express.static('public'));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");

//MongoDB related
const questionSchema = new mongoose.Schema({
    testNum: Number,
    section: String,
    questionNum: Number,
    instruction: String,
    passage: String,
    passage_title: String,
    passageQ: Number,
    question: String,
    mathQuestion: Buffer,
    choiceA: String,
    choiceB: String,
    choiceC: String,
    choiceD: String
});
const Question = mongoose.model("Question", questionSchema);

const answerSchema = new mongoose.Schema({
    answer: String,
    questionNum: String
})
const Answer = mongoose.model("Answer", answerSchema);

// Answer.create({
//     answer : "answer8",
//     questionNum : "3"
// })


// let encodeImage = fs.readFileSync('./public/images/test1_math_question1.PNG');
// Question.create({
//     testNum: 1,
//     section: "math_1",
//     questionNum: 9,
//     instruction: "",
//     passage: "",
//     passage_title: "",
//     passageQ : 3, //question that passage will be stored in (passage q from 1-10 then passage is in qestion 1)
//     question: "",
//     mathQuestion: new Buffer(encodeImage).toString('base64'),
//     choiceA : 'Students deserve an opportunity to learn about all world religions, not just the major world religions.',
//     choiceB : 'State officials and school districts should make an effort to ensure that students are exposed to the study of world religions in their social studies courses.',
//     choiceC : 'It is important to ensure that students understand that many aspects of history, literature, and current events are related to ideas found in major world religions.',
//     choiceD : 'Although there is hesitation to teach about religions in school, the benefits of students becoming familiar with the main ideas and tenets of world religions are essential in today’s world.'
// })

//passport related database (Later refactor)
let UserSchema = new mongoose.Schema({
    username: String,
    passowrd: String
})

UserSchema.plugin(passportLocalMongoose);

app.use(require("express-session")({
    secret: "Anything can go in here",
    resave: false,
    saveUninitialized: false
}))
let User = mongoose.model("User", UserSchema);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render('landing');
})

app.get("/testIntro", (req, res) => {
    res.render("testIntro");
})

app.get("/quiz", (req, res) => {
    Answer.find({}, (err, answers) => {
        if (err) {
            console.log("Error in finding answer");
        } else {

            Question.find({}, (err, questions) => {
                if (err) {
                    console.log(err);
                } else {
                    if (req.xhr) {
                        res.json(questions, answers);
                    } else {
                        res.render("quiz", {
                            questions: questions,
                            answers: answers
                        });
                    }
                }
            })
        }
    })
});

app.post("/quiz", (req, res) => {
    req.body.choices = req.sanitize(req.body.choices); //stops any type of script enjection
    var choice = req.body.choices;
    var qNum = req.body.question;
    var obj = {
        answer: choice,
        questionNum: qNum
    }; //or just use req.body

    /**
     * Replaced Answer.findOne with Answer.updateOne
     * updateOne and passing upsert:true checks if object
     * is in the db and if not it adds to db and if it is 
     * then it updates the db
     */
    Answer.updateOne({
        "questionNum": qNum
    }, obj, {
        upsert: true
    }, function (err, success) {
        if (err) {
            console.log("Error occured posting to the mongodb");
        } else {
            // res.json(data); //what ever is sent here is received by the 
            Question.find({}, (err, questions) => {
                if (err) {
                    console.log("There is an error");
                } else {
                    Answer.find({}, (err, answers) => {
                        if (err)
                            console.log("error occured");
                        else
                            res.json({
                                questions,
                                answers
                            });
                    })
                    // res.json(questions);
                }
            });
        }
    })
});

//==============
//Auth Route
//===============
app.get("/register", function (req, res) {
    res.render("register");
})

app.post("/register", function (req, res) {
    const newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function () {
            res.redirect("/");
        })
    });
})


app.listen(PORT, () => {
    console.log("Connected");
})