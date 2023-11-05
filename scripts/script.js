let userA = 0;
let userB = 0;
let userOp = null;
let clearText = 0;
const displayElement = document.querySelector('#display');
const historyElement = document.querySelector('#history');
let displayNumber = Number(displayElement.textContent);


function calculate(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
            break;
        case "-":
            return a - b;
            break;
        case "x":
            return a * b;
            break;
        case "/":
            return a / b;
            break;
        default:
            console.log(op);
            return "oops";
    }
}

function appendDisplay(e) {
    // adds the clicked number to the end of the display, stores new value as a mathable variable 
    // checks to see if input is key or mouse, which changes how the text is added
    if (clearText == 1) {displayElement.textContent = ""};
    if (e.key) {
        displayElement.textContent += e.key;
    } else {
        displayElement.textContent += e.target.value;
    }
    displayNumber = Number(displayElement.textContent);
    clearText = 0;
}

function clickOperand(e) {
    let inputTxt = 0;
    let inputOp = 0;
    // splitting up mouse vs key, sets vars depending on what is used
    if (e.key) {
        inputTxt = e.key;
        inputOp = e.key;
    } else {
        inputTxt = e.target.textContent;
        inputOp = e.target.value;
    }
    if (userOp !== null && displayElement.textContent !== "" && displayNumber !== "") {
        // performs the calculation if there is already an existing equation
        // Updates the display and history with calculation outcome
        displayElement.textContent = calculate(userA, displayNumber, userOp);
        historyElement.textContent = `${displayElement.textContent} ${inputTxt} `;
        displayNumber = Number(displayElement.textContent);
    } else if (userOp === null) {
        // moves the displayed number to the history line and adds the operand to the end
        displayNumber = Number(displayElement.textContent);
        historyElement.textContent = `${displayNumber} ${inputTxt} `;
        displayElement.textContent = "";
    } else {
        historyElement.textContent = "";
        displayElement.textContent = "error";
    }
    // updates the operand with the one that was just clicked
    // updates the user variable with the newly displayed number
    userOp = inputOp;
    clearText = 1;
    userA = displayNumber;
    displayNumber = "";
}

function clickEquals() {
    if (historyElement.textContent.includes('=')) {historyElement.textContent += `${displayNumber} = `};
    displayElement.textContent = calculate(userA, displayNumber, userOp);
    clearText = 1;
}

function clickClear() {
    displayElement.textContent = "";
    historyElement.textContent = "";
    userOp = null;
    userA = 0;
    displayNumber = 0;
}

numShortcuts = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
opShortcuts = ['+', '-', '*', '/'];

document.querySelectorAll('.number').forEach((item) => item.addEventListener('click', appendDisplay));
document.querySelector('.clear').addEventListener('click', clickClear);
document.querySelectorAll('.operand').forEach((item) => item.addEventListener('click', clickOperand));
document.querySelector('.compute').addEventListener('click', clickEquals);

document.addEventListener('keyup', (e) => {
    console.log(e);
    if (numShortcuts.includes(e.key)) {
        appendDisplay(e);
    } else if (opShortcuts.includes(e.key)) {
        clickOperand(e);
    } else if (e.key === "Enter") {
        clickEquals(e);
    }
});