let userA = 0;
let userB = 0;
let userOp = null;
let clearText = 1;
const displayElement = document.querySelector('#display');
const historyElement = document.querySelector('#history');
let displayNumber = 0;
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
    displayElement.textContent = "0";
    historyElement.textContent = "";
    userOp = null;
    userA = 0;
    userB = 0;
    displayNumber = 0;
    displayStr = "";
}

function convertExponential(num) {
    // number that's passed to this function is converted and the length compared to max display size
    // any excess length is removed from the max length of the scientific notation
    let length = num.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 11}).length
    let over = ((length - 15) > 0) ? (length - 15) : 0;
    return num.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 11-over});
}

function negative(num) {
    if (num > 0) {
        return -Math.abs(num);
    } else if (num < 0) {
        return Math.abs(num);
    } else {
        updateDisplay("error");
    }
}

function updateDisplay(origin, inputTxt) {
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
        case "opExists":
            // multiple operands calculate the current expression and add the new operator
            displayElement.textContent = historyA;
        case "opEmpty":
            // new operators and operators while display is empty simply update the operator on the history
            historyElement.textContent = `${historyA} ${inputTxt} `;
            break;
        case "equals":
            // equal sign shows entire equation with the solution in the display
            historyElement.textContent = `${historyA} ${displayOp} ${historyB} = `;
            displayElement.textContent = displayNumber;
            break;
        case "overflow":
            historyElement.textContent = "";
            displayElement.textContent = "OVERFLOW";
            return;
            break;
        default:
            displayElement.textContent = "error";
    }
    // after everything is resolved, checks to see if it fits on calculator screen
    if (displayElement.textContent.length > 15) {
        displayElement.textContent = convertExponential(displayNumber);
    } else {
        displayElement.textContent = displayNumber.toLocaleString('en-US', {maximumFractionDigits: 15});
    }
    test(historyA, historyB);
}

function clickButton(origin, inputVal, inputTxt) {
    switch (origin) {
        case "negative":
            if (displayNumber === 0) {
                return;
            } else {
                displayNumber = negative(displayNumber);
            }
            if (!userOp) { // updates user variable depending on if an operand is clicked yet
                userA = displayNumber;
            } else {
                userB = displayNumber;
            }
            break;
        case "mouseclick":
        case "keypress": // mouseclick or keypress on a number button
            if (inputTxt === "." && (displayStr.includes('.') || typeof displayNumber == "bigint")) inputTxt = ""; // only lets you put one decimal
            if (clearText === 2) clickClear();
            displayStr += inputTxt; // updates display variable with new number clicked
            if (Number(displayStr) >= Number.MAX_SAFE_INTEGER) {
                displayNumber = BigInt(displayStr);
            } else {
                displayNumber = Number(displayStr);
            }
            if (!userOp) { // updates user variable depending on if an operand is clicked yet
                userA = displayNumber;
            } else {
                userB = displayNumber;
            }
            clearText = 0;
            break;
        case "op":
            // sets variables depending on calc status when an operand is clicked
            if (userOp === null || (clearText && userOp)) {
                origin = "opEmpty";
                if (clearText === 2) (userA = displayNumber);
            } else if (!clearText && userOp) {
                origin = "opExists";
                displayNumber = calculate(userA, userB, userOp);
                userA = displayNumber;
            } else {
                return; // multiple operators in a row get returned
            }
            // updating globals after any calculations are completed
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
            displayStr = "";
            break;
        default:
            origin = "error"
    }
    if (displayNumber >= Number.MAX_VALUE) {
        origin = "overflow";
        clickClear();
    }
    // after button clicking is resolved and variables are set, sends data to update the display screen
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
document.querySelector('.backspace').addEventListener('click', (e) => clickButton("backspace"));
document.querySelector('.negative').addEventListener('click', (e) => clickButton("negative"));

// keyboard shortcut listeners, calls the same functions as above
// depending on which key is pressed, passes event data through
document.addEventListener('keydown', (e) => {
    const numShortcuts = ['.', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const opShortcuts = ['+', '-', '*', '/'];
    if (numShortcuts.includes(e.key)) {
        e.preventDefault();
        clickButton("keypress", e.key, e.key);
    } else if (opShortcuts.includes(e.key)) {
        e.preventDefault();
        document.querySelector(`[value=${CSS.escape(e.key)}]`).click();
    } else if (e.key === "Enter") {
        e.preventDefault();
        clickButton("equals");
    } else if (e.key === "Backspace") {
        e.preventDefault();
        clickButton("backspace", "", "");
    }
}, true);