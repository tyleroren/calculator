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
        case "*":
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

function appendDisplay(origin, inputTxt) {
    // updates display depending on the origin of the function call
    switch (origin) {
        case "mouseclick":
        case "keypress":
            // number buttons just add to the end of the display
            if (clearText) {displayElement.textContent = ""};
            displayElement.textContent += inputTxt;
            break;
        case "opNew":
            // new operands move the display to the history and add the operator
            historyElement.textContent = `${displayNumber} ${inputTxt} `;
            break;
        case "opExists":
            // next operands calculate the current expression and add the new operator
            displayElement.textContent = calculate(userA, userB, userOp);
            historyElement.textContent = `${displayElement.textContent} ${inputTxt} `;
            break;
        case "opEmpty":
            // clicking operator while the display is empty just changes the history
            historyElement.textContent = `${userA} ${inputTxt} `;
            break;
        default:
            displayElement.textContent = "error";
    }
    displayNumber = Number(displayElement.textContent);
    clearText = 0;
    updateVars();
}

function clickOperand(inputVal, inputTxt) {
    if (inputTxt === "*") inputTxt = "x";
    if (inputTxt === "/") inputTxt = "&divide;";
    if (userOp === null) {
        // if no operand has been selected yet, then sends the clicked operand to appendDisplay
        userA = displayNumber;
        appendDisplay("opNew", inputTxt);
    } else if (userOp !== null && displayNumber !== 0 && !clearText) {
        // if operand has already been chosen, then sends the numbers to be calculated and the new operand to be updated
        userB = displayNumber;
        appendDisplay("opExists", inputTxt);
        userA = displayNumber;
    } else if (userOp !== inputVal && clearText) {
        // if there's an existing operand but empty display, then sends new operand to update in the history line
        appendDisplay("opEmpty", inputTxt);
    } else {
        return;
    }
    // updates global operand variable with the value of clicked operand
    userOp = inputVal;
    clearText = 1;
    updateVars();
}

function clickEquals() {
    if (clearText || !userOp) {return};
    if (!historyElement.textContent.includes('=')) {historyElement.textContent += `${displayNumber} = `};
    displayElement.textContent = calculate(userA, displayNumber, userOp);
    userA = displayElement.textContent;
    clearText = 1;
}

function clickClear() {
    displayElement.textContent = "";
    historyElement.textContent = "";
    userOp = null;
    userA = 0;
    userB = 0;
    displayNumber = 0;
    updateVars();
}

function updateVars() {
    document.querySelector('.displayNumber').textContent = displayNumber;
    document.querySelector('.userA').textContent = userA;
    document.querySelector('.userB').textContent = userB;
    document.querySelector('.userOp').textContent = userOp;
    document.querySelector('.clearText').textContent = clearText;
}

// button listeners, calls the corresponding function and passes event data through
document.querySelectorAll('.number').forEach((item) => item.addEventListener('click', (e) => {
    appendDisplay("mouseclick", e.target.textContent);
}));
document.querySelectorAll('.operand').forEach((item) => item.addEventListener('click', (e) => {
    clickOperand(e.target.value, e.target.textContent);
}));
document.querySelector('.clear').addEventListener('click', clickClear);
document.querySelector('.compute').addEventListener('click', clickEquals);

// keyboard shortcut listeners, calls the same functions as above
// depending on which key is pressed, passes event data through
document.addEventListener('keydown', (e) => {
    const numShortcuts = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const opShortcuts = ['+', '-', '*', '/'];
    if (numShortcuts.includes(e.key)) {
        appendDisplay("keypress", e.key);
    } else if (opShortcuts.includes(e.key)) {
        clickOperand(e.key, e.key);
    } else if (e.key === "Enter") {
        e.preventDefault();
        clickEquals();
    }
}, true);