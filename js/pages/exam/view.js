const examView = {
    showScreen:   (screen) => {
        let app = document.querySelector('.app-container')
        switch (screen) {
            case 'testType': {
                app.innerHTML = examComponents.testType
                layoutView.saveLocation('testType')
                break
            }
            case 'structuredTest': {
                let list30Index = examModel.list30Index
                examController.getStructuredIndex()

                const getQuestionObject = () => {
                    return new Promise((resolve, reject) => {
                        examController.getQuestionObject()
                        if (examModel.dataState) {
                            resolve(examModel.list30Question)
                        } else {
                            reject("có lỗi xảy ra")
                        }
                    })
                }
                let promise1 = getQuestionObject()
                    .then(result => {
                        app.innerHTML = examComponents.structuredTest
                        examController.createList30Answer()
                        examView.showQuestionBoxes()
                        examView.showFirstQuestion(result)
                        examView.setUpButtons(list30Index)
                        let testAnswerForm = document.querySelector(".test-answer-form")
                        testAnswerForm.addEventListener("change",() => {
                            examController.saveUserAnswerTo(examModel.thisQuestionName)
                            examView.changeDoneQuestionBoxColor()
                        })
                    })
                    .catch(err => console.log(err))
                console.log("promise1", promise1)





                break
            }
        }
    },

    showQuestionBoxes: () => {
        let questionContainer = document.querySelector(".question-container")                     
        for (let i = 0; i < 30; i += 5) {
            questionContainer.innerHTML += `
            <div class="row col-container justify-content-between mx-0 mb-3">
                <div class="col-2 px-0 ">
                    <div class="question-box bg--grey2 color--white1" 
                    id="question-${i + 1}">${i + 1}</div>
                </div>
                <div class="col-2 px-0 ">
                    <div class="question-box bg--grey2 color--white1" 
                    id="question-${i + 2}">${i + 2}</div>
                </div>
                <div class="col-2 px-0 ">
                    <div class="question-box bg--grey2 color--white1" 
                    id="question-${i + 3}">${i + 3}</div>
                </div>
                <div class="col-2 px-0 ">
                    <div class="question-box bg--grey2 color--white1" 
                    id="question-${i + 4}">${i + 4}</div>
                </div>
                <div class="col-2 px-0 ">
                    <div class="question-box bg--grey2 color--white1" 
                    id="question-${i + 5}">${i + 5}</div>
                </div>
            </div>
            `
        }
    },

    showQuestion: (index, list30Question) => {        
        let questionObject = list30Question[index]        
        let testQuestion = document.querySelector(".test-question")
        let testImage = document.querySelector(".test-image")
        testQuestion.innerHTML = questionObject.question
        testImage.innerHTML = (questionObject.images) ?
            (`<img src=${questionObject.images}>`) 
            : 
            ('')
        let questionAnwerContainers = document.querySelectorAll(".test-answer-container")
        questionObject.answers.forEach( (element,index) => {
            if (questionObject.answers[index].value) {
                questionAnwerContainers[index].innerHTML = `
                <input type="checkbox" id="answer-${index + 1}" name="answer-${index + 1}" >
                <label for="answer-${index + 1}">
                    ${questionObject.answers[index].value}
                </label>
                `
            } else if (questionObject.answers[index].value == null) {
                questionAnwerContainers[index].innerHTML = []
            }
        })
        
        let userAnswer = examModel.list30Answer[index].userAnswer
        userAnswer.forEach((element) => {
            let checkedAnswer = document.querySelector(`#answer-${element}`)
            checkedAnswer.setAttribute("checked","")
        })
    },

    changeCurrentQuestionBoxColor: (currentQuestionBox) => {
        let questionBoxes = document.querySelectorAll('.question-box') 
        questionBoxes.forEach(element => {
            element.classList.remove('current-question')
        })
        currentQuestionBox.classList.add('current-question')
    },

    changeDoneQuestionBoxColor: () => {
        let list30Answer = examModel.list30Answer
        list30Answer.forEach((element, index) => {
            let userAnswer = list30Answer[index].userAnswer
            let questionBox = document.querySelector(`#question-${index + 1}`)
            if (userAnswer.length) {
                questionBox.classList.add('done-question')
            } else {
                questionBox.classList.remove('done-question')
            }
        })
    },

    showFirstQuestion: (list30Question) => {
        
            examView.showQuestion(0, list30Question)
            examView.changeCurrentQuestionBoxColor(document.getElementById('question-1'))
        
    },

    setUpButtons: (list30Index) => {
        list30Index.forEach((element, index) => {                 
            let questionBox = document.querySelector(`#question-${index + 1}`)
            questionBox.addEventListener("click", () => {
                examView.showQuestion(index, examModel.list30Question)
                examView.changeCurrentQuestionBoxColor(questionBox)
                examController.saveThisQuestionName(index + 1)
            })
        })
    },
    // khóa các nút chọn testtype trong lúc test load
    loadTest: (testType, testSelector) => {
        let structuredTest = document.querySelector(testSelector)
        examView.showScreen(testType)
        setTimeout(() => {
            structuredTest.addEventListener("click", examView.showScreen(testType))            
        }, 2500)
    },


}