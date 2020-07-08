//collection of unused code (saved just in case)

/**
 * from ajax.js file 
 */
// $('#edit-item-form').submit(function (e) {
//     //when form is submitted it prevents default and comes to execute code here
//     e.preventDefault();
//     var todoItem = $(this).serialize(); //gets the result data from the form
//     var thisUrl = $(this).attr('action');
//     $.post(thisUrl, todoItem, function (data) { //this posts will go to the url in app.js "post" section 
//     //gets all the question in the db and finds the next question by incrementing the index(global variable that keeps track of the question num);
//         let question = data[idx++]; //increment the global variable to show later 
//         console.log(todoItem);
//         $('#edit-item-form').html( //changes the content inside the form with new question
//             `
//                         <h1>${question.instruction}</h1>
//                         <h1>${question.passage}</h1>
//                         <h1>Question: ${question.questionNum}</h1><br>
//                         <div class="form-group" id="innerForm">
//                             <input type="radio" id="choice1" name="choices" value="answer1">
//                             <label for="choice1">answer1</label><br>
//                             <input type="radio" id="choice2" name="choices" value="answer2">
//                             <label for="choice2">answer2</label><br>
//                             <input type="radio" id="choice3" name="choices" value="answer3">
//                             <label for="choice3">answer3</label><br>
//                             <input type="radio" id="choice4" name="choices" value="answer4">
//                             <label for="choice4">answer4</label><br>
//                             <input type="hidden" name="idNum" value="${question._id}"/>
//                             <button type="submit" class="btn btn-primary">Update Item</button>
//                         </div>
//                 `
//         );
//     });
// });



//-----------------------------------------------------------------------------------------------------------------


/*
app.post("/quiz", (req, res) => {
    req.body.choices = req.sanitize(req.body.choices); //stops any type of script enjection
    var choice = req.body.choices;
    var qNum = req.body.question;
    var obj = {
        answer: choice,
        questionNum: qNum
    }; //or just use req.body
    //try to replace this whole thing by using Answer.,update() with upsert which adds if document doesnt exist and updates if it does or bulkWrite
    Answer.findOne({
        "questionNum": qNum
    }, function (err, found) {
        if (found) { //if found the question in the database, means there already exist answer for that question so update it
            //prevent submitting without any data
            //do Answer.put (to update)
            Answer.update(found, obj, function(err, success){
                if (err) {
                    console.log("Error occured posting to the mongodb");
                } else {
                    // res.json(data); //what ever is sent here is received by the 
                    Question.find({}, (err, questions) => {
                        if (err) {
                            console.log("There is an error");
                        } else {
                            res.json(questions);
                        }
                    });
                }
            })
        } else {
            console.log("ran here");
            Answer.create(obj, (err, data) => {
                if (err) {
                    console.log("Error occured posting to the mongodb");
                } else {
                    // res.json(data); //what ever is sent here is received by the 
                    Question.find({}, (err, questions) => {
                        if (err) {
                            console.log("There is an error");
                        } else {
                            res.json(questions);
                        }
                    });
                }
            });
        }
    })
});
*/