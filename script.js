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
              try {
                  let input = screen.value
                      .replace(/×/g, '*')
                      .replace(/÷/g, '/')
                      .replace(/%/g, '/100*');

                  if (input.endsWith('*')) {
                      input = input.slice(0, -1);
                  }

                  screen.value = eval(input);
              } catch (e) {
                  screen.value = "Error";
              }
          } else {
              screen.value += value;
          }
      });
  });
});
function gcd(a, b) {
    return b ? gcd(b, a % b) : a;
}

function decimalToFraction(decimal) {
    const tolerance = 1.0E-10;
    let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
    let b = decimal;
    do {
        const a = Math.floor(b);
        let aux = h1; h1 = a * h1 + h2; h2 = aux;
        aux = k1; k1 = a * k1 + k2; k2 = aux;
        b = 1 / (b - a);
    } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
    return h1 + "/" + k1;
}

function isFraction(input) {
    return /^-?\d+\/\d+$/.test(input);
}

function fractionToDecimal(fraction) {
    const [numerator, denominator] = fraction.split('/');
    return parseFloat(numerator) / parseFloat(denominator);
}

// Extend the existing button loop:
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.getAttribute("data-value");

        if (value === "DEL") {
            screen.value = screen.value.slice(0, -1);
        } else if (value === "AC") {
            screen.value = "";
        } else if (value === "=") {
            try {
                let input = screen.value
                    .replace(/×/g, '*')
                    .replace(/÷/g, '/')
                    .replace(/%/g, '/100*');

                if (input.endsWith('*')) {
                    input = input.slice(0, -1);
                }

                screen.value = eval(input);
            } catch (e) {
                screen.value = "Error";
            }
        } else if (value === "S⇔D") {
            const val = screen.value.trim();
            if (!val) return;

            if (isFraction(val)) {
                screen.value = fractionToDecimal(val);
            } else {
                const num = parseFloat(val);
                if (!isNaN(num)) {
                    screen.value = decimalToFraction(num);
                }
            }
        } else {
            screen.value += value;
        }
    });
});
