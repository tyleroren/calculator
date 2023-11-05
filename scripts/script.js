let userA = 0;
let userB = 0;
let userOp = null;
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

function appendDisplay(num) {
    // adds the clicked number to the end of the display, stores new value as a mathable variable 
    displayElement.textContent += num;
    displayNumber = Number(displayElement.textContent);
}

function clickOperand(op) {
    if (userOp !== null && displayElement.textContent !== "") {
        userOp = op.value;
        displayElement.textContent = calculate(userA, displayNumber, userOp);
        historyElement.textContent = `${displayElement.textContent} ${op.textContent} `;
        displayNumber = Number(displayElement.textContent);
        userA = displayNumber;
    }

    if (userOp === null) {
        // moves the displayed number to the history line and adds the operand to the end
        historyElement.textContent = `${displayNumber} ${op.textContent} `;
        // store the number and operand separately for mathing later, clear variables 
        userOp = op.value;
        userA = displayNumber;
        displayElement.textContent = "";
        displayNumber = 0;
    }
}

function clickEquals() {
    historyElement.textContent += `${displayNumber} = `;
    displayElement.textContent = calculate(userA, displayNumber, userOp);
}

function clickClear() {
    displayElement.textContent = "";
    historyElement.textContent = "";
    userOp = null;
    userA = 0;
    displayNumber = 0;
}

document.querySelectorAll('.number').forEach((item) => item.addEventListener('click', () => appendDisplay(item.value)));
document.querySelector('.clear').addEventListener('click', () => clickClear());
document.querySelectorAll('.operand').forEach((item) => item.addEventListener('click', () => clickOperand(item)));
document.querySelector('.compute').addEventListener('click', () => clickEquals());