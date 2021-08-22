
//API URL get the DataSet
var apiURL = 'https://s3.amazonaws.com/s3.helloheart.home.assignment/bloodTestConfig.json';

var testResults = document.getElementById("testResults");

validateForm = () => {
    var inputTestName = document.getElementById("inputTestName").value;
    var inputTestResult = document.getElementById("inputTestResult").value;
    //only A-Za-z0-9()-:/!* characters allowed
    var charactersPattern = /^[A-Za-z0-9()-:/!* ]+$/;
    var isValid = charactersPattern.test(inputTestName);

    //inputTestName not empty
    if (inputTestName == "") {
        alert("Field 'Test Name' must be filled out !");
        return false;
    }

    //inputTestName with A-Za-z0-9()-:/!* characters only
    if (!isValid) {
        alert("Field 'Test Name' allowed Contains Characters : 'A-Z', 'a-z', '0-9' and '(),-:/. only !");
        return false;
    }

    //inputTestResult not empty
    else if (inputTestResult == "") {
        alert("Field 'Test Result' must be filled out !");
        return false;
    }

    //everythin validate
    else {
        findTets();
    }
}

//clear all fields when press 'Clear' button
clearFields = () => {
    document.getElementById("inputTestName").value = "";
    document.getElementById("inputTestResult").value = "";
    document.getElementById("testNameForm").innerHTML = "";
    document.getElementById("testResultForm").innerHTML = "";
    testResults.style.display = "none";
}

//main function
findTets = () => {
    var headers = {}

    fetch(apiURL, {
        method: "GET",
        mode: 'cors',
        headers: headers
    })
        .then(res => res.json())
        .then((out) => {
            //console.log('JSON Data : ', out);
            matchTest(out);
        })
        .catch(err => { throw err });
}

//find the test by user input
matchTest = (testsData) => {
    var testName = '';
    var testThreshold;
    var testResult;

    var userTestNameInput = document.getElementById("inputTestName").value.toUpperCase();

    switch (true) {
        case userTestNameInput.includes(testsTypes.HDL):
            testName = 'HDL Cholesterol';
            break;
        case userTestNameInput.includes(testsTypes.LDL):
            testName = 'LDL Cholesterol';
            break;
        case userTestNameInput.includes(testsTypes.A1C):
            testName = 'A1C';
            break;
        case userTestNameInput.includes(testsTypes.ECG):
            testName = 'ECG';
            break;
    }

    testThreshold = getThreshold(testName, testsData);
    testResult = analyzeResult(testThreshold);
    printResult(testName, testResult);
}

//find the threshold
getThreshold = (testName, testsData) => {
    for (let test of testsData.bloodTestConfig) {
        if (test.name == testName) {
            return test.threshold;
        }
    }
}

//analyze result by test name threshold
analyzeResult = (testThreshold) => {
    var userTestResultInput = parseInt(document.getElementById("inputTestResult").value);

    switch (true) {
        case userTestResultInput <= testThreshold:
            return testsResults[1];
        case userTestResultInput > testThreshold:
            return testsResults[2];
        default:
            return testsResults[3];
    }
}

//print data to DOM
printResult = (testName, testResult) => {
    testResults.style.display = "block";
    document.getElementById("testNameForm").innerHTML = testName;
    document.getElementById("testResultForm").innerHTML = testResult;
}