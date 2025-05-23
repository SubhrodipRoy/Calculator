document.addEventListener("DOMContentLoaded", () => {
    const screen = document.getElementById("screen");
    const dropdownBtn = document.querySelector(".dropbtn");
    const dropdownContent = document.getElementById("myDropdown");
    const searchInput = document.getElementById("myInput");

    // Toggle dropdown
    dropdownBtn.addEventListener("click", () => {
        dropdownContent.classList.toggle("show");
    });

    // Filter constants in dropdown
    searchInput.addEventListener("keyup", () => {
        const filter = searchInput.value.toUpperCase();
        const links = dropdownContent.querySelectorAll("a[data-value]");

        links.forEach((link) => {
            const text = link.textContent || link.innerText;
            link.style.display = text.toUpperCase().includes(filter) ? "" : "none";
        });
    });

    // Append constant to screen on click
    dropdownContent.querySelectorAll("a[data-value]").forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const value = link.getAttribute("data-value");
            screen.value += value;
            dropdownContent.classList.remove("show");
            searchInput.value = "";
            dropdownContent.querySelectorAll("a[data-value]").forEach((a) => {
                a.style.display = "";
            });
        });
    });

    // Close dropdown on outside click
    window.addEventListener("click", (event) => {
        if (!event.target.matches('.dropbtn') && !event.target.matches('#myInput')) {
            dropdownContent.classList.remove("show");
        }
    });

    // Handle all button presses with class "tap"
    const buttons = document.querySelectorAll("button.tap");
    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const value = button.getAttribute("data-value");

            if (value === "DEL") {
                screen.value = screen.value.slice(0, -1);
            } else if (value === "AC") {
                screen.value = "";
            } else if (value === "=") {
                screen.value = evaluateExpression(screen.value);
            } else if (value === "S⇔D") {
                const input = screen.value.trim();

                if (/^\d+\/\d+$/.test(input)) {
                    const [num, denom] = input.split("/").map(Number);
                    screen.value = denom === 0 ? "Error" : (num / denom).toString();
                } else if (!isNaN(input)) {
                    const decimal = parseFloat(input);
                    screen.value = decimalToFraction(decimal);
                } else {
                    const result = evaluateExpression(input);
                    screen.value = (typeof result === "number" && !isNaN(result)) ? decimalToFraction(result) : "Error";
                }
            } else if (["sin", "cos", "tan", "sin^-1", "cos^-1", "tan^-1"].includes(value)) {
                screen.value += `${value}(`;
            } else {
                screen.value += value;
            }
        });
    });

    // Convert decimal to fraction
    function decimalToFraction(decimal) {
        const tolerance = 1.0E-10;
        let h1 = 1, h2 = 0;
        let k1 = 0, k2 = 1;
        let b = decimal;
        do {
            let a = Math.floor(b);
            let aux = h1; h1 = a * h1 + h2; h2 = aux;
            aux = k1; k1 = a * k1 + k2; k2 = aux;
            b = 1 / (b - a);
        } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);

        return `${h1}/${k1}`;
    }

    // Evaluate expression with constants and trigonometry
    function evaluateExpression(expression) {
        // Replace constants
        expression = expression.replace(/π/g, Math.PI.toString());
        expression = expression.replace(/(?<!\w)e(?![a-zA-Z])/g, Math.E.toString());

        // Replace operators
        expression = expression.replace(/×/g, '*')
                               .replace(/÷/g, '/')
                               .replace(/%/g, '/100*');

        // Replace inverse trig functions
        expression = expression.replace(/sin\^-1\(/g, 'Math.asin(');
        expression = expression.replace(/cos\^-1\(/g, 'Math.acos(');
        expression = expression.replace(/tan\^-1\(/g, 'Math.atan(');

        // Convert regular trig functions to radians
        expression = expression.replace(/sin\(([^)]+)\)/g, 'Math.sin(($1)*Math.PI/180)');
        expression = expression.replace(/cos\(([^)]+)\)/g, 'Math.cos(($1)*Math.PI/180)');
        expression = expression.replace(/tan\(([^)]+)\)/g, 'Math.tan(($1)*Math.PI/180)');

        // Trim trailing operator
        if (/[+\-*/.]$/.test(expression)) {
            expression = expression.slice(0, -1);
        }

        try {
            return eval(expression);
        } catch (e) {
            return "Error";
        }
    }
});
