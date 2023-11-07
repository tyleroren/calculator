let userA = 0;
let userB = 0;
let userOp = null;
let clearText = 1;
const displayElement = document.querySelector('#display');
const historyElement = document.querySelector('#history');
let displayNumber = Number(displayElement.textContent);
let displayOp = null;


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

function updateDisplay(origin, inputTxt) {
    // puts the unformatted number back on the screen for manipulating in switch
    // checks history numbers sizes
    displayElement.textContent = displayNumber;
    const historyA = (userA.toString().length > 12) ? convertExponential(userA) : userA;
    const historyB = (userB.toString().length > 12) ? convertExponential(userB) : userB;
    // clearText is a flag variable. 0 = do nothing, 1 = clear display div, 2 = reset calc
    // updates display depending on the origin of the function call
    switch (origin) {
        case "mouseclick":
        case "keypress":
            // number buttons just add to the end of the display
            if (clearText === 2) {clickClear()};
            if (clearText) {displayElement.textContent = ""};
            displayElement.textContent += inputTxt;
            userB = BigInt(displayElement.textContent);
            break;
        case "opNew":
            // new operands move the display to the history and add the operator
            historyElement.textContent = `${historyB} ${inputTxt} `;
            break;
        case "opExists":
            // next operands calculate the current expression and add the new operator
            displayElement.textContent = calculate(userA, userB, userOp);
            historyElement.textContent = `${displayElement.textContent} ${inputTxt} `; //DEBUG THIS LINE, WONT WORK WITH EXP, NEED A REPLACEMENT VAR
            break;
        case "opEmpty":
            // clicking operator while the display is empty just changes the history
            historyElement.textContent = `${historyA} ${inputTxt} `;
            break;
        case "equals":
            historyElement.textContent = `${historyA} ${inputTxt} ${historyB} = `;
            displayElement.textContent = calculate(userA, userB, userOp);
            break;
        default:
            displayElement.textContent = "error";
    }
    displayNumber = BigInt(displayElement.textContent);
    displayElement.textContent = displayNumber.toLocaleString();
    clearText = 0;
    // after everything is resolved, checks to see if it fits on calculator screen
    if (displayElement.textContent.length > 15) {
        displayElement.textContent = convertExponential(displayNumber);
    }
    test(historyA, historyB);
}

function convertExponential(num) {
    // displayNumber's length in SciNote is passed to this function and compared to max length of the display screen
    // any excess length is removed from the max length of the scientific notation
    let length = num.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 11}).length
    let over = ((length - 15) > 0) ? (length - 15) : 0;
    return displayNumber.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 11-over});
}

function clickOperand(inputVal, inputTxt) {
    userB = displayNumber;
    if (userOp === null) {
        // if no operand has been selected yet, then sends the clicked operand to updateDisplay
        userA = displayNumber;
        updateDisplay("opNew", inputTxt);
    } else if (userOp !== null && displayNumber !== 0 && !clearText) {
        // if operand has already been chosen, this sends the numbers to be calculated and the new operand to be updated
        updateDisplay("opExists", inputTxt);
        userA = displayNumber;
    } else if (clearText) {
        // if there's an existing operand but empty display, this sends the new operand to update history line
        updateDisplay("opEmpty", inputTxt);
    } else {
        return;
    }
    // updates global operand variable with the new clicked value
    userOp = inputVal;
    displayOp = inputTxt;
    clearText = 1;
}

function clickEquals() {
    if (!userOp) {return};
    if (clearText === 1) userB = BigInt(displayElement.textContent);
    updateDisplay("equals", displayOp);
    userA = displayNumber;
    clearText = 2;
}

function clickClear() {
    displayElement.textContent = "";
    historyElement.textContent = "";
    userOp = null;
    userA = 0;
    userB = 0;
    displayNumber = 0;
}

function test(a, b) {
    document.querySelector('.userA').textContent = userA;
    document.querySelector('.historyA').textContent = a;
    document.querySelector('.userB').textContent = userB;
    document.querySelector('.historyB').textContent = b;
    document.querySelector('.displayNumber').textContent = displayNumber;
}

// button listeners, calls the corresponding function and passes event data through
document.querySelectorAll('.number').forEach((item) => item.addEventListener('click', (e) => {
    updateDisplay("mouseclick", e.target.textContent);
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
        updateDisplay("keypress", e.key);
    } else if (opShortcuts.includes(e.key)) {
        clickOperand(e.key, e.key);
    } else if (e.key === "Enter") {
        e.preventDefault();
        clickEquals();
    }
}, true);