let userA = 0;
let userB = 0;
let userOp = null;
let clearText = 0;
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
    // clearText is a flag variable. 0 = do nothing, 1 = clear display div, 2 = reset calc
    // updates display depending on the origin of the function call
    displayElement.textContent = Number(displayElement.textContent.replaceAll(",", "")).toLocaleString().replaceAll(",", "");
    
    switch (origin) {
        case "mouseclick":
        case "keypress":
            // number buttons just add to the end of the display
            if (clearText === 2) {clickClear()};
            if (clearText) {displayElement.textContent = ""};
            displayElement.textContent += inputTxt;
            userB = Number(displayElement.textContent);
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
        case "equals":
            historyElement.textContent = `${userA} ${inputTxt} ${userB} = `;
            displayElement.textContent = calculate(userA, userB, userOp);
            break;
        default:
            displayElement.textContent = "error";
    }
    displayNumber = Number(displayElement.textContent);
    displayElement.textContent = displayNumber.toLocaleString();
    clearText = 0;

    if (displayElement.textContent.length > 14) {
        displayElement.textContent = Number(displayElement.textContent.replaceAll(",", "")).toExponential(8);
    }
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