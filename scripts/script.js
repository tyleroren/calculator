let userA = 0;
let userB = 0;
let userOp = null;
const displayElement = document.querySelector('#display');

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}


function calculate(a, b, op) {
    switch (op) {
        case "+":
            return add(a, b);
            break;
        case "-":
            return subtract(a, b);
            break;
        case "*":
            return multiply(a, b);
            break;
        case "/":
            return divide(a, b);
            break;
        default:
            return "oops";
    }
}

function appendDisplay(num) {
    displayElement.textContent += num;
}

document.querySelectorAll('.number').forEach((item) => item.addEventListener('click', () => appendDisplay(item.value)));
document.querySelector('.clear').addEventListener('click', () => displayElement.textContent = "");
