let userA = 0n;
let userB = 0n;
let userOp = null;
let clearText = 1;
const displayElement = document.querySelector('#display');
const historyElement = document.querySelector('#history');
let displayNumber = 0n;
let displayStr = "";
let displayOp = null;


function test(a, b) {
    document.querySelector('.userA').textContent = userA + " " + typeof userA;
    document.querySelector('.historyA').textContent = a + " " + typeof a;
    document.querySelector('.userB').textContent = userB + " " + typeof userB;
    document.querySelector('.historyB').textContent = b + " " + typeof b;
    document.querySelector('.displayNumber').textContent = displayNumber + " " + typeof displayNumber;
    document.querySelector('.userOp').textContent = userOp + " " + typeof userOp;
    document.querySelector('.clearText').textContent = clearText;
    document.querySelector('.displayStr').textContent = displayStr + " " + typeof displayStr;
}

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

function clickClear() {
    displayElement.textContent = "";
    historyElement.textContent = "";
    userOp = null;
    userA = 0n;
    userB = 0n;
    displayNumber = 0n;
    displayStr = "";
}

function convertExponential(num) {
    // displayNumber's length in SciNote is passed to this function and compared to max length of the display screen
    // any excess length is removed from the max length of the scientific notation
    let length = num.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 11}).length
    let over = ((length - 15) > 0) ? (length - 15) : 0;
    return displayNumber.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 11-over});
}

function updateDisplay(origin, inputTxt) {
    // puts the unformatted number back on the screen for manipulating in switch
    // checks history numbers sizes
    // displayElement.textContent = displayNumber;
    const historyA = (userA.toString().length > 12) ? convertExponential(userA) : userA;
    const historyB = (userB.toString().length > 12) ? convertExponential(userB) : userB;
    // clearText is a flag variable. 0 = do nothing, 1 = clear display div, 2 = reset calc
    // updates display depending on the origin of the function call
    switch (origin) {
        case "mouseclick":
        case "keypress":
            if (clearText === 2) {clickClear()};
            if (clearText) {displayElement.textContent = ""};
            displayElement.textContent = displayNumber;
            break;
        case "opNew":
            // new operands move the display to the history and add the operator
            historyElement.textContent = `${historyA} ${inputTxt} `;
            break;
        case "opEmpty":
            // clicking operator while the display is empty just changes the history
            historyElement.textContent = `${historyA} ${inputTxt} `;
            break;
        case "opExists":
            // next operands calculate the current expression and add the new operator
            displayElement.textContent = userA;
            historyElement.textContent = `${historyA} ${inputTxt} `;
            break;
        case "equals":
            historyElement.textContent = `${historyA} ${displayOp} ${historyB} = `;
            displayElement.textContent = displayNumber;
            break;
        default:
            displayElement.textContent = "error";
    }
    displayElement.textContent = displayNumber.toLocaleString();
    // after everything is resolved, checks to see if it fits on calculator screen
    if (displayElement.textContent.length > 15) {
        displayElement.textContent = convertExponential(displayNumber);
    }
}

function clickButton(origin, inputVal, inputTxt) {
    switch (origin) {
        case "mouseclick":
        case "keypress":
            displayStr += inputTxt; // updates display variable with new number clicked
            displayNumber = BigInt(displayStr);
            if (!userOp) { // updates user variable depending on if an operand is clicked yet
                userA = BigInt(displayNumber);
            } else {
                userB = BigInt(displayNumber);
            }
            clearText = 0;
            break;
        case "op":
            if (userOp === null) {
                origin = "opNew";
            } else if (clearText && userOp) {
                origin = "opEmpty";
                if (clearText === 2) (userA = displayNumber);
            } else if (!clearText && userOp) {
                origin = "opExists";
                displayNumber = calculate(userA, userB, userOp);
                userA = displayNumber;
            } else {
                return;
            }
            userB = userA;
            userOp = inputVal;
            displayOp = inputTxt;
            clearText = 1;
            displayStr = "";
            break;
        case "equals":
            if (!userOp) {return};
            if (clearText === 1) userB = displayNumber;
            if (clearText === 2) userA = displayNumber;
            displayNumber = calculate(userA, userB, userOp);
            clearText = 2;
            break;
        default:
            origin = "error"
    }
    updateDisplay(origin, inputTxt);
}

// button listeners, calls the corresponding function and passes event data through
document.querySelectorAll('.number').forEach((item) => item.addEventListener('click', (e) => {
    clickButton("mouseclick", e.target.value, e.target.textContent);
}));
document.querySelectorAll('.operand').forEach((item) => item.addEventListener('click', (e) => {
    clickButton("op", e.target.value, e.target.textContent);
}));
document.querySelector('.clear').addEventListener('click', clickClear);
document.querySelector('.compute').addEventListener('click', (e) => clickButton("equals"));

// keyboard shortcut listeners, calls the same functions as above
// depending on which key is pressed, passes event data through
document.addEventListener('keydown', (e) => {
    const numShortcuts = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const opShortcuts = ['+', '-', '*', '/'];
    if (numShortcuts.includes(e.key)) {
        clickButton("keypress", e.key, e.key);

    } else if (opShortcuts.includes(e.key)) {
        document.querySelector(`[value=${CSS.escape(e.key)}]`).click();
    } else if (e.key === "Enter") {
        e.preventDefault();
        clickButton("equals");
    }
}, true);