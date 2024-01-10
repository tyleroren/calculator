let userA = "0";
let userB = "0";
let userOp = null;
let clearText = 1;
let displayNumber = "0";
let displayOp = null;

function calculate(a, b, op) {
    switch (op) {
        case "+":
            return (a + b);
        case "-":
            return (a - b);
        case "*":
            return (a * b);
        case "/":
            return (a / b);
        default:
            return "oops";
    }
}

function clickButton(origin, inputVal, inputTxt) {
    // clearText is a flag variable. 0 = do nothing, 1 = clear display div, 2 = reset calc
    switch (origin) {
        case "mouseclick":
        case "keypress": // mouseclick or keypress on a number button
            if (lengthCheck(displayNumber) >= 19) return;
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
                displayNumber = calculate(Number(userA), Number(userB), userOp).toString();
                userA = displayNumber;
            } else {
                return; // multiple operators in a row get returned
            }
            // updating globals after any calculations are completed
            userB = userA;
            userOp = inputVal;
            displayOp = inputTxt;
            clearText = 1;
            displayNumber = "0";
            break;
        case "backspace":
            if (clearText === 2) {
                clickClear();
            } else {
                displayNumber = "0";
                if (!userOp) {
                    userA = "0";
                } else {
                    userB = "0";
                }
            }
            break;
        case "negative":
            if (Number(displayNumber) === 0) {
                return;
            } else {
                displayNumber = negative(Number(displayNumber)).toString();
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
            displayNumber = calculate(Number(userA), Number(userB), userOp).toString();
            clearText = 2;
            break;
        default:
            origin = "error"
    }
    [displayNumber, userA, userB].forEach((n) => {
        if (lengthCheck(n) > 19) origin = "overflow";
    });
    updateDisplay(origin, inputTxt, userA, userB, displayNumber);
}

function updateDisplay(origin, inputTxt, a, b, dn) {
    const displayElement = document.querySelector('#display');
    const historyElement = document.querySelector('#history');
    // adding commas to the displayNumber, and userA and B strings
    Array.from(arguments).forEach((item, index) => {
        if (index > 1) {
            arguments[index] = addCommas(arguments[index]);
        }
    });
    // updates display depending on the origin of the function call
    switch (origin) {
        case "mouseclick":
        case "keypress":
        case "negative":
            displayElement.textContent = dn;
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
            displayElement.textContent = dn;
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
}

function lengthCheck(str) {
    let convNum = Math.abs(Number(str)).toLocaleString('en-us', {maximumFractionDigits: 20});
    if ((Number(str).toString().indexOf('.') > -1) && (Number(str).toString().length > 16)) {
        return 19;
    } else {
        return convNum.length;
    }
}

function addCommas(str) {
    if (str.indexOf('.') > -1) {
        return (Number(str.slice(0, str.indexOf('.'))).toLocaleString('en-us', {maximumFractionDigits: 20})) + (str.slice(str.indexOf('.')));
    } else {
        return Number(str).toLocaleString('en-us', {maximumFractionDigits: 20});
    }
}

function negative(num) {
    console.log(num);
    if (num > 0) {
        return -Math.abs(num);
    } else if (num < 0) {
        return Math.abs(num);
    } else {
        updateDisplay("error");
    }
}

function clickClear() {
    userOp = null;
    userA = "0";
    userB = "0";
    displayNumber = "0";
    clearText = 1;
    updateDisplay("clear");
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