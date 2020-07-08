let idx = 0;

/**
 * when button pressed delete the existing 
 * question on the page and update it with 
 * the next question on the page
 */

$('#edit-item-form').submit(function (e) {
    //when form is submitted it prevents default and comes to execute code here
    e.preventDefault();
    let todoItem = $(this).serialize(); //gets the result data from the form
    todoItem += "&question=" + (idx + 1);
    let thisUrl = $(this).attr('action');
    let whichButton = $(document.activeElement).attr('id'); //lets you know which button was clicked to submit the form
    let question;
    let receivedAnswer;
    if (whichButton == "prev") {
        $("#edit-item-form input[name='choices']").removeAttr('required');
    }
    $.post(thisUrl, todoItem, function (data) { //this posts will go to the url in app.js "post" section 
        //gets all the question in the db and finds the next question by incrementing the index(global variable that keeps track of the question num);
        // console.log(data);
        if (whichButton == "prev") {
            if (idx == 0) {
                return;
            }
            idx -= 1;
            question = data.questions[idx];
            receivedAnswer = data.answers[idx];
        } else {
            idx += 1;
            question = data.questions[idx]; //increment the global variable to show later 
            receivedAnswer = data.answers[idx];
        }
        let passageInQ = question.passageQ; // tells which question the passage is stored in 
        if (question.section == "short_passage") {
            $('#edit-item-form').html( //changes the content inside the form with new question
                `
                    <p>${question.questionNum}. ${question.instruction}</p>
                    <div class="container border border-dark">
                        <p class="passage">${question.passage}</p>
                    </div>
                    <div class="container">
                        <br>
                        <p>${question.question}</p>
                        <input type="radio" id="choice1" name="choices" value="answer1" required>
                        <label for="choice1">${question.choiceA}</label><br>
                        <input type="radio" id="choice2" name="choices" value="answer2">
                        <label for="choice2">${question.choiceB}</label><br>
                        <input type="radio" id="choice3" name="choices" value="answer3">
                        <label for="choice3">${question.choiceC}</label><br>
                        <input type="radio" id="choice4" name="choices" value="answer4">
                        <label for="choice4">${question.choiceD}</label><br>
                    </div>
                    <div class="container text-center">
                        <button type="submit" class="btn btn-danger" id="prev">Prev</button>
                        <button type="submit" class="btn btn-primary" id="next">Next</button>
                    </div>
                `
            );
        } else if (question.section == "long_passage") {
            $('#edit-item-form').html( //changes the content inside the form with new question
                `
                    <h3 class="centerIt">${data.questions[passageInQ-1].passage_title}</h3>
                    <div class="container border border-dark">
                        <p class="passage">${data.questions[passageInQ-1].passage}</p> 
                    </div>
                    <div class="container">
                        <br>
                        <p>${question.questionNum}. ${question.question}</p>
                        <input type="radio" id="choice1" name="choices" value="answer1" required>
                        <label for="choice1">${question.choiceA}</label><br>
                        <input type="radio" id="choice2" name="choices" value="answer2">
                        <label for="choice2">${question.choiceB}</label><br>
                        <input type="radio" id="choice3" name="choices" value="answer3">
                        <label for="choice3">${question.choiceC}</label><br>
                        <input type="radio" id="choice4" name="choices" value="answer4">
                        <label for="choice4">${question.choiceD}</label><br>
                    </div>
                    <div class="container text-center">
                        <button type="submit" class="btn btn-danger" id="prev">Prev</button>
                        <button type="submit" class="btn btn-primary" id="next">Next</button>
                    </div>
                `
            );
        }
        // $('[name="choices"]').removeAttr('checked');
        if (receivedAnswer != undefined) { //check if there is a previous answer
            $("input[name=choices][value=" + receivedAnswer.answer + "]").attr('checked', 'checked'); //mark it if there is
        }
    });
});
