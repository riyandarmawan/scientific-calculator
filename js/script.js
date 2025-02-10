const display = document.getElementById('display');
const btns = document.querySelectorAll('.btn');

const operators = { "+": '+', "-": "-", "*": "*", "/": "/" };

for (let item of btns) {
    item.addEventListener('click', (e) => {
        const text = e.target.innerHTML;

        if (display.value === 'Error' && text !== '=') {
            display.value = '';
        } else if (operators[text] && !display.value) {
            display.value = '';
        } else if (text === 'C') {
            display.value = '';
        } else if (!isNaN(text) && display.value.includes('x')) {
            display.value = display.value.replace('x', text);
        }
        // Handle implicit multiplication (e.g., 2(3) → 2 * 3)
        else if (!isNaN(text) && display.value.endsWith(')')) {
            display.value += `*${text}`;
        }
        // Replace consecutive operators (e.g., 5++3 → 5+3)
        else if (e.target.classList.contains('operator') && operators[display.value.slice(-1)]) {
            display.value = `${display.value.slice(0, -1)}${text}`;
        }
        // Handle math functions (sin, cos, tan, log)
        else if ({ sin: 'sin', cos: 'cos', tan: 'tan', log: 'log', '√': '√' }[text]) {
            display.value += `${text}(`;
        }
        // Handle constants π and e
        else if (text === 'π' || text === 'e') {
            display.value += text;
        }
        else if (text !== '=') {
            display.value += text;
        }
    });
}

// Calculation function
function calculate() {
    let expression = display.value;

    const replacements = {
        'sin': 'Math.sin',
        'cos': 'Math.cos',
        'tan': 'Math.tan',
        'log': 'Math.log10' in Math ? 'Math.log10' : '(x => Math.log(x) / Math.LN10)',
        '√': 'Math.sqrt',
        'π': 'Math.PI',
        'e': 'Math.E',
        '²': '**2'
    };

    Object.keys(replacements).forEach((key) => {
        expression = expression.replaceAll(key, replacements[key]);
    });

    // Convert implicit multiplication, e.g., 2(3) → 2 * 3
    expression = expression.replace(/(\d+)\(/g, "$1*(");
    // Convert 2log8 → 2 * Math.log(8)
    expression = expression.replace(/(\d+)(Math\.(sin|cos|tan|log))/g, "$1*$2");

    try {
        display.value = new Function(`return ${expression}`)();
    } catch (error) {
        display.value = "Error";
    }
}
