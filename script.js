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
          } else if (value === "S⇔D") {
              // S⇔D button functionality: Decimal ↔ Fraction
              if (screen.value.includes("/")) {
                  // Fraction to Decimal conversion
                  const fractionParts = screen.value.split("/");
                  if (fractionParts.length === 2) {
                      const numerator = parseFloat(fractionParts[0]);
                      const denominator = parseFloat(fractionParts[1]);
                      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
                          screen.value = (numerator / denominator).toString();
                      } else {
                          screen.value = "Error";
                      }
                  }
              } else {
                  // Decimal to Fraction conversion
                  const decimalValue = parseFloat(screen.value);
                  if (!isNaN(decimalValue)) {
                      const fraction = decimalToFraction(decimalValue);
                      screen.value = fraction;
                  } else {
                      screen.value = "Error";
                  }
              }
          } else {
              screen.value += value;
          }
      });
  });

  // Function to convert decimal to fraction
  function decimalToFraction(decimal) {
      const precision = 1e12; // Increased precision level to avoid errors
      let denominator = precision;
      let numerator = Math.round(decimal * denominator);

      // Simplify the fraction by finding the GCD
      const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
      const commonDivisor = gcd(numerator, denominator);

      // Simplify the fraction
      numerator = numerator / commonDivisor;
      denominator = denominator / commonDivisor;

      // To avoid overly large fractions, simplify them further by limiting the denominator size
      if (denominator > 1000000) {
          return decimal.toFixed(12); // Return the decimal as string if the fraction is too complex
      }

      return `${numerator}/${denominator}`;
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
