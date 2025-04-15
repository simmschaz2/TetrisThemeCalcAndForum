// Calculator JavaScript functionality

// DOM elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const memoryDisplayElement = document.getElementById('memory-display');
const historyContainer = document.getElementById('history');
const clearHistoryBtn = document.getElementById('clear-history-btn');
const themeToggle = document.getElementById('theme-toggle');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;
let memoryValue = 0;
let history = [];
let lastAnswer = null;

// Theme management
themeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('calculator-theme', themeToggle.checked ? 'dark' : 'light');
});

// Check for saved theme preference
if (localStorage.getItem('calculator-theme') === 'dark') {
    themeToggle.checked = true;
    document.body.classList.add('dark-theme');
}

// Load history from local storage
function loadHistory() {
    const savedHistory = localStorage.getItem('calculator-history');
    if (savedHistory) {
        history = JSON.parse(savedHistory);
        renderHistory();
    }
}

// Save history to local storage
function saveHistory() {
    localStorage.setItem('calculator-history', JSON.stringify(history));
}

// Render history items
function renderHistory() {
    historyContainer.innerHTML = '';
    history.forEach((item, index) => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        historyItem.textContent = `${item.calculation} = ${item.result}`;
        historyItem.addEventListener('click', () => {
            currentOperand = item.result;
            updateDisplay();
        });
        historyContainer.appendChild(historyItem);
    });
}

// Add to history
function addToHistory(calculation, result) {
    history.unshift({ calculation, result });
    if (history.length > 10) {
        history.pop();
    }
    saveHistory();
    renderHistory();
}

// Clear history
clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('calculator-history');
    renderHistory();
});

// Button animation
function animateButton(element) {
    if (element) {
        element.classList.add('button-pressed');
        setTimeout(() => {
            element.classList.remove('button-pressed');
        }, 200);
    }
}

// Add animation to all buttons
document.querySelectorAll('.calculator button').forEach(button => {
    button.addEventListener('click', function() {
        animateButton(this);
    });
});

// Helper Functions
function updateDisplay() {
    currentOperandElement.textContent = currentOperand;
    if (operation != null) {
        previousOperandElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = previousOperand;
    }
    
    // Update memory display
    if (memoryValue !== 0) {
        memoryDisplayElement.textContent = `M: ${memoryValue}`;
    } else {
        memoryDisplayElement.textContent = '';
    }
}

function clearAll() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteDigit() {
    if (currentOperand === '0') return;
    if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function appendNumber(number) {
    if (resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    // Handle decimal point
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Replace initial 0 unless it's a decimal
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function appendOperator(operator) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = operator;
    previousOperand = currentOperand;
    resetScreen = true;
    updateDisplay();
}

function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                currentOperand = 'Error';
                previousOperand = '';
                operation = undefined;
                updateDisplay();
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        case 'xʸ':
            computation = Math.pow(prev, current);
            break;
        default:
            return;
    }
    
    // Add to history
    const calculationString = `${previousOperand} ${operation} ${currentOperand}`;
    const result = computation.toString();
    addToHistory(calculationString, result);
    
    // Format the result
    currentOperand = result;
    lastAnswer = currentOperand;
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

// Scientific functions
function square() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseFloat(currentOperand);
    const result = Math.pow(num, 2);
    
    addToHistory(`${currentOperand}²`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function squareRoot() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseFloat(currentOperand);
    
    if (num < 0) {
        currentOperand = 'Error';
        updateDisplay();
        return;
    }
    
    const result = Math.sqrt(num);
    
    addToHistory(`√${currentOperand}`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function calculatePower() {
    if (currentOperand === '0' || currentOperand === '') return;
    appendOperator('xʸ');
}

function calculateSin() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseFloat(currentOperand);
    const result = Math.sin(num * Math.PI / 180); // Convert to radians
    
    addToHistory(`sin(${currentOperand})`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function calculateCos() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseFloat(currentOperand);
    const result = Math.cos(num * Math.PI / 180); // Convert to radians
    
    addToHistory(`cos(${currentOperand})`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function calculateTan() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseFloat(currentOperand);
    const result = Math.tan(num * Math.PI / 180); // Convert to radians
    
    addToHistory(`tan(${currentOperand})`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function calculateFactorial() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseInt(currentOperand);
    
    if (num < 0 || !Number.isInteger(num)) {
        currentOperand = 'Error';
        updateDisplay();
        return;
    }
    
    let result = 1;
    for (let i = 2; i <= num; i++) {
        result *= i;
    }
    
    addToHistory(`${currentOperand}!`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function calculateLog() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseFloat(currentOperand);
    
    if (num <= 0) {
        currentOperand = 'Error';
        updateDisplay();
        return;
    }
    
    const result = Math.log10(num);
    
    addToHistory(`log(${currentOperand})`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function calculateLn() {
    if (currentOperand === '0' || currentOperand === '') return;
    const num = parseFloat(currentOperand);
    
    if (num <= 0) {
        currentOperand = 'Error';
        updateDisplay();
        return;
    }
    
    const result = Math.log(num);
    
    addToHistory(`ln(${currentOperand})`, result.toString());
    
    currentOperand = result.toString();
    lastAnswer = currentOperand;
    updateDisplay();
}

function calculatePi() {
    currentOperand = Math.PI.toString();
    updateDisplay();
}

function toggleSign() {
    if (currentOperand === '0' || currentOperand === '') return;
    currentOperand = (parseFloat(currentOperand) * -1).toString();
    updateDisplay();
}

// Memory functions
function memoryClear() {
    memoryValue = 0;
    updateDisplay();
}

function memoryRecall() {
    currentOperand = memoryValue.toString();
    updateDisplay();
}

function memoryAdd() {
    memoryValue += parseFloat(currentOperand || '0');
    resetScreen = true;
    updateDisplay();
}

function memorySubtract() {
    memoryValue -= parseFloat(currentOperand || '0');
    resetScreen = true;
    updateDisplay();
}

function memoryStore() {
    memoryValue = parseFloat(currentOperand || '0');
    resetScreen = true;
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    // Numbers
    if (/^[0-9]$/.test(event.key)) {
        event.preventDefault();
        appendNumber(event.key);
        animateButton(document.querySelector(`button:contains('${event.key}')`));
    }
    // Operators
    else if (event.key === '+') {
        event.preventDefault();
        appendOperator('+');
        animateButton(document.querySelector(`button:contains('+')`));
    }
    else if (event.key === '-') {
        event.preventDefault();
        appendOperator('-');
        animateButton(document.querySelector(`button:contains('-')`));
    }
    else if (event.key === '*') {
        event.preventDefault();
        appendOperator('×');
        animateButton(document.querySelector(`button:contains('×')`));
    }
    else if (event.key === '/') {
        event.preventDefault();
        appendOperator('÷');
        animateButton(document.querySelector(`button:contains('÷')`));
    }
    // Decimal point
    else if (event.key === '.') {
        event.preventDefault();
        appendNumber('.');
        animateButton(document.querySelector(`button:contains('.')`));
    }
    // Equals
    else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculate();
        animateButton(document.querySelector(`button:contains('=')`));
    }
    // Backspace
    else if (event.key === 'Backspace') {
        event.preventDefault();
        deleteDigit();
        animateButton(document.querySelector(`button:contains('DEL')`));
    }
    // Clear
    else if (event.key === 'Escape') {
        event.preventDefault();
        clearAll();
        animateButton(document.querySelector(`button:contains('AC')`));
    }
    // Parentheses
    else if (event.key === '(') {
        event.preventDefault();
        appendOperator('(');
        animateButton(document.querySelector(`button:contains('(')`));
    }
    else if (event.key === ')') {
        event.preventDefault();
        appendOperator(')');
        animateButton(document.querySelector(`button:contains(')')`));
    }
    // Percent
    else if (event.key === '%') {
        event.preventDefault();
        appendOperator('%');
        animateButton(document.querySelector(`button:contains('%')`));
    }
});

// Custom selector for buttons
HTMLElement.prototype.contains = function(text) {
    return this.textContent.includes(text);
};

// Initialize
loadHistory();
updateDisplay();