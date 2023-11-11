let userA = 0;
let userB = 0;
let userOp = null;
let clearText = 1;
let displayNumber = "0";
let displayOp = null;


function test(a, b) {
    document.querySelector('.userA').textContent = userA + " " + typeof userA;
    document.querySelector('.historyA').textContent = a + " " + typeof a;
    document.querySelector('.userB').textContent = userB + " " + typeof userB;
    document.querySelector('.historyB').textContent = b + " " + typeof b;
    document.querySelector('.displayNumber').textContent = displayNumber + " " + typeof displayNumber;
    document.querySelector('.converted').textContent = Number(displayNumber).toLocaleString('en-US', {maximumFractionDigits: 20});
    document.querySelector('.length').textContent = Number(displayNumber).toLocaleString('en-US', {maximumFractionDigits: 20}).length;
    document.querySelector('.userOp').textContent = userOp + " " + typeof userOp;
    document.querySelector('.clearText').textContent = clearText;
}

function calculate(a, b, op) {
    let result = 0;
    if (Number(a) >= Number.MAX_SAFE_INTEGER || Number(b) >= Number.MAX_SAFE_INTEGER) {
        a = BigInt(Math.round(a));
        b = BigInt(Math.round(b));
    } else {
        a = Number(a);
        b = Number(b);
    }
    switch (op) {
        case "+":
            result = (a + b);
            break;
        case "-":
            result = (a - b);
            break;
        case "*":
            result = (a * b);
            break;
        case "/":
            result = (a / b);
            break;
        default:
            return "oops";
    }
    // size check
    if (typeof result === "bigint" || result > 999999999999999) {
        return convertExponential(result);
    } else if (typeof result === "number") {
        round(result, 16);
        if (lengthCheck(result)) {
            updateDisplay("error");
        } else {
            return result.toString();
        }
    }
}

function clickButton(origin, inputVal, inputTxt) {
    switch (origin) {
        case "mouseclick":
        case "keypress": // mouseclick or keypress on a number button
            if (inputTxt === "." && (displayNumber.includes('.') || typeof displayNumber == "bigint")) inputTxt = ""; // only lets you put one decimal
            if (clearText === 2) clickClear();
            if (clearText === 1) displayNumber = "0";
            displayNumber += inputTxt; // updates display variable with new number clicked
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
            // displayNumber = "";
            break;
        case "backspace":
            if (clearText === 2) {
                clickClear();
            } else {
                displayNumber = "0";
                if (!userOp) {
                    userA = 0;
                } else {
                    userB = 0;
                }
            }
            break;
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
    // after button clicking is resolved and variables are set, sends data to update the display screen
    if (lengthCheck(displayNumber)) displayNumber = displayNumber.slice(0, -1);
    updateDisplay(origin, inputTxt, userA, userB, displayNumber);
}

function updateDisplay(origin, inputTxt, a, b, dn) {
    const displayElement = document.querySelector('#display');
    const historyElement = document.querySelector('#history');

    // take the userA (a) userB (b) and displayNumber (dn) from the arguments and check length of each
    Array.from(arguments).forEach((item, index) => {
        if (index > 1) {
            if (Number(arguments[index]) >= Number.MAX_SAFE_INTEGER) {
                arguments[index] = BigInt(Math.round(item));
            } else {
                arguments[index] = Number(item);
            }
            if (arguments[index].toLocaleString('en-US', {maximumFractionDigits: 20}).length > 19) convertExponential(arguments[index]);
        }
    });
    // clearText is a flag variable. 0 = do nothing, 1 = clear display div, 2 = reset calc
    // updates display depending on the origin of the function call
    switch (origin) {
        case "mouseclick":
        case "keypress":
            displayElement.textContent = dn.toLocaleString('en-US', {maximumFractionDigits: 20});
            if (displayNumber.endsWith(".")) displayElement.textContent += ".";
            break;
        case "opExists":
            // multiple operands calculate the current expression and add the new operator
            displayElement.textContent = a;
        case "opEmpty":
            // new operators and operators while display is empty simply update the operator on the history
            historyElement.textContent = `${a} ${inputTxt} `;
            break;
        case "equals":
            // equal sign shows entire equation with the solution in the display
            historyElement.textContent = `${a} ${displayOp} ${b} =`;
            displayElement.textContent = displayNumber;
            break;
        case "overflow":
            historyElement.textContent = "";
            displayElement.textContent = "OVERFLOW";
            return;
            break;
        case "clear":
            historyElement.textContent = "";
        case "backspace":
            displayElement.textContent = "0";
            break;
        default:
            displayElement.textContent = "error";
    }

    // displayElement.textContent = displayNumber.toLocaleString('en-US', {maximumFractionDigits: 15});
    // // after everything is resolved, checks to see if it fits on calculator screen
    // if (displayElement.textContent.length > 15) {
    //     displayElement.textContent = convertExponential(displayNumber);
    // } else {
        
    // }

test(a, b);
}

function clickClear() {
    userOp = null;
    userA = 0;
    userB = 0;
    displayNumber = "0";
    clearText = 1;
    updateDisplay("clear");
}

function convertExponential(num) {
    // any excess length is removed from the max length of the scientific notation
    let length = num.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 15}).length
    let over = ((length - 19) > 0) ? (length - 15) : 0;
    return num.toLocaleString('en-US', {notation: 'scientific', maximumFractionDigits: 15-over});
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

function lengthCheck(str) {
    // all the stupid length tests to prevent the variable from getting too large to become a number
    return Number(str).toLocaleString('en-US', {maximumFractionDigits: 20}).length > 18 ||
        (str.slice(str.indexOf(".")).length > 16)
}

function round(value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
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