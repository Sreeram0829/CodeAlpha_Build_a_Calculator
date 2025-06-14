let currentInput = '0';
        let previousInput = '';
        let operation = null;
        let resetScreen = false;

        const resultDisplay = document.getElementById('result');
        const historyDisplay = document.getElementById('history');

        function updateDisplay() {
            resultDisplay.textContent = currentInput;
            historyDisplay.textContent = previousInput + (operation ? ' ' + getOperationSymbol(operation) : '');
        }

        function getOperationSymbol(op) {
            switch(op) {
                case '+': return '+';
                case '-': return '−';
                case '*': return '×';
                case '/': return '÷';
                case '%': return '%';
                case '^': return '^';
                default: return op;
            }
        }

        function appendNumber(number) {
            if (currentInput === '0' || resetScreen) {
                currentInput = number;
                resetScreen = false;
            } else {
                if (number === '.' && currentInput.includes('.')) return;
                currentInput += number;
            }
            updateDisplay();
        }

        function appendOperation(op) {
            if (operation !== null && !resetScreen) {
                calculate();
            }
            operation = op;
            previousInput = currentInput;
            resetScreen = true;
            updateDisplay();
        }

        function calculate() {
            if (operation === null || resetScreen) return;
            
            let computation;
            const prev = parseFloat(previousInput);
            const current = parseFloat(currentInput);
            
            if (isNaN(prev)) return;
            
            try {
                switch (operation) {
                    case '+':
                        computation = prev + current;
                        break;
                    case '-':
                        computation = prev - current;
                        break;
                    case '*':
                        computation = prev * current;
                        break;
                    case '/':
                        if (current === 0) {
                            computation = 'Error';
                        } else {
                            computation = prev / current;
                        }
                        break;
                    case '%':
                        computation = prev % current;
                        break;
                    case '^':
                        computation = Math.pow(prev, current);
                        break;
                    default:
                        if (operation.startsWith('Math.')) {
                            computation = eval(operation + '(' + prev + ')');
                            if (operation === 'Math.PI' || operation === 'Math.E') {
                                computation = eval(operation);
                            }
                        } else {
                            return;
                        }
                }
                
                if (typeof computation === 'number') {
                    if (computation > 1e12 || (computation < 1e-6 && computation > 0)) {
                        computation = computation.toExponential(6);
                    } else {
                        computation = parseFloat(computation.toFixed(8));
                    }
                    currentInput = computation.toString();
                } else {
                    currentInput = computation;
                }
            } catch (e) {
                currentInput = 'Error';
            }
            
            operation = null;
            previousInput = '';
            resetScreen = true;
            updateDisplay();
        }

        function clearDisplay() {
            currentInput = '0';
            previousInput = '';
            operation = null;
            updateDisplay();
        }

        function backspace() {
            if (currentInput.length === 1 || (currentInput.length === 2 && currentInput.startsWith('-'))) {
                currentInput = '0';
            } else {
                currentInput = currentInput.slice(0, -1);
            }
            updateDisplay();
        }

        function calculateFunction(func) {
            const value = parseFloat(currentInput);
            if (isNaN(value)) return;
            
            try {
                let result;
                switch(func) {
                    case 'Math.sqrt':
                        if (value < 0) throw "Error";
                        result = Math.sqrt(value);
                        break;
                    case 'Math.sin':
                        result = Math.sin(value * Math.PI / 180); // Degrees to radians
                        break;
                    case 'Math.cos':
                        result = Math.cos(value * Math.PI / 180);
                        break;
                    case 'Math.tan':
                        result = Math.tan(value * Math.PI / 180);
                        break;
                    case 'Math.log':
                        if (value <= 0) throw "Error";
                        result = Math.log(value);
                        break;
                    case 'Math.log10':
                        if (value <= 0) throw "Error";
                        result = Math.log10(value);
                        break;
                    case 'Math.abs':
                        result = Math.abs(value);
                        break;
                    default:
                        return;
                }
                
                if (Math.abs(result) > 1e12 || (Math.abs(result) < 1e-6 && result !== 0)) {
                    result = result.toExponential(6);
                } else {
                    result = parseFloat(result.toFixed(8));
                }
                
                previousInput = func.replace('Math.', '') + '(' + currentInput + ')';
                currentInput = result.toString();
                operation = null;
                resetScreen = true;
                updateDisplay();
            } catch (e) {
                currentInput = 'Error';
                updateDisplay();
            }
        }

        function calculatePower() {
            previousInput = currentInput;
            operation = '^';
            resetScreen = true;
            updateDisplay();
        }

        function calculateFactorial() {
            const num = parseInt(currentInput);
            if (num < 0 || isNaN(num)) {
                currentInput = 'Error';
            } else if (num === 0 || num === 1) {
                currentInput = '1';
            } else {
                let result = 1;
                for (let i = 2; i <= num; i++) {
                    result *= i;
                }
                currentInput = result.toString();
            }
            updateDisplay();
        }

        function calculateReciprocal() {
            const value = parseFloat(currentInput);
            if (value === 0) {
                currentInput = 'Error';
            } else {
                currentInput = (1 / value).toString();
            }
            updateDisplay();
        }

        function toggleSign() {
            if (currentInput.startsWith('-')) {
                currentInput = currentInput.substring(1);
            } else {
                currentInput = '-' + currentInput;
            }
            updateDisplay();
        }

        // Keyboard support
        document.addEventListener('keydown', (event) => {
            if (event.key >= '0' && event.key <= '9') {
                appendNumber(event.key);
            } else if (event.key === '.') {
                appendNumber('.');
            } else if (['+', '-', '*', '/', '%', '^'].includes(event.key)) {
                appendOperation(event.key);
            } else if (event.key === 'Enter' || event.key === '=') {
                event.preventDefault();
                calculate();
            } else if (event.key === 'Backspace') {
                backspace();
            } else if (event.key === 'Escape') {
                clearDisplay();
            } else if (event.key === 'Delete') {
                clearDisplay();
            } else if (event.key === '(' || event.key === ')') {
                appendOperation(event.key);
            } else if (event.key === '!') {
                calculateFactorial();
            } else if (event.key === 'p') {
                appendOperation('Math.PI');
            } else if (event.key === 'e') {
                appendOperation('Math.E');
            } else if (event.key === 'r') {
                calculateFunction('Math.sqrt');
            } else if (event.key === 's') {
                calculateFunction('Math.sin');
            } else if (event.key === 'c') {
                calculateFunction('Math.cos');
            } else if (event.key === 't') {
                calculateFunction('Math.tan');
            } else if (event.key === 'l') {
                calculateFunction('Math.log');
            } else if (event.key === 'L') {
                calculateFunction('Math.log10');
            } else if (event.key === 'a') {
                calculateFunction('Math.abs');
            } else if (event.key === 'R') {
                calculateReciprocal();
            } else if (event.key === '_') {
                toggleSign();
            }
        });

        updateDisplay();