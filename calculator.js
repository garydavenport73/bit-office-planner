let calcInput = document.getElementById('calculator-input');
document.getElementById("clear-calc").addEventListener("click", clearCalc);
document.getElementById("remove-last-char").addEventListener("click", removeLastChar);
document.getElementById("equals-button").addEventListener("click", evaluateCalculatorInput);
let theseCalculatorButtons = document.getElementsByClassName('build-calc-string');
for (let calculatorButton of theseCalculatorButtons) {
    calculatorButton.addEventListener("click", () => { buildCalcString(calculatorButton.innerHTML) });
}

function buildCalcString(str) {
    calcInput.value += str;
}

function clearCalc() {
    calcInput.value = "";
}

function removeLastChar() {
    calcInput.value = calcInput.value.slice(0, -1);
}

function evaluateCalculatorInput() {
    let sanitizedValue = calcInput.value.replace(/[^-+/*\de.]/g, '');
    if (sanitizedValue != calcInput.value) {
        alert("Unallowed characters replaced with empty space during evaluation.");
    }
    document.getElementById('last-calculator-expression').innerHTML = "Evaluated: " + sanitizedValue;
    let result = '';
    try {
        // result = eval(sanitizedValue);
        result = evalReplaceFunction(sanitizedValue);
    } catch (error) {
        result = error;
    }
    calcInput.value = result;
}

function evalReplaceFunction(str) {
    return Function("'use strict'; return (" + str + ")")();
}
