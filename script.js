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
            event.preventDefault(); // prevent anchor jump
            const value = link.getAttribute("data-value");
            screen.value += value;
            dropdownContent.classList.remove("show");
            searchInput.value = "";
            // Show all again
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
            } 
            else if (value === "S⇔D") {
                const input = screen.value.trim();
            
                if (/^\d+\/\d+$/.test(input)) {
                    // It's a fraction, convert to decimal
                    const [num, denom] = input.split("/").map(Number);
                    if (denom === 0) {
                        screen.value = "Error";
                    } else {
                        screen.value = (num / denom).toString();
                    }
                } else if (!isNaN(input)) {
                    // It's a decimal, convert to simplified fraction
                    const decimal = parseFloat(input);
                    screen.value = decimalToFraction(decimal);
                } else {
                    // Evaluate expression, then try to convert result
                    const result = evaluateExpression(input);
                    if (typeof result === "number" && !isNaN(result)) {
                        screen.value = decimalToFraction(result);
                    } else {
                        screen.value = "Error";
                    }
                }
            }
            
            else {
                screen.value += value;
            }
        });
    });

    // Function to convert decimal to fraction
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
    

    // Function to evaluate the expression with constants
    function evaluateExpression(expression) {
        // Replace symbols with actual values
        expression = expression.replace(/π/g, Math.PI.toString());
        expression = expression.replace(/(?<!\w)e(?![a-zA-Z])/g, Math.E.toString());

        // Replace mathematical operators
        expression = expression.replace(/×/g, '*')
                               .replace(/÷/g, '/')
                               .replace(/%/g, '/100*');

        // Trim trailing operators
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
