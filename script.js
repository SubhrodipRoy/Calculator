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
  });
 
  document.addEventListener("DOMContentLoaded", () => {
    const screen = document.getElementById("screen");

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
                    const input = screen.value
                        .replace(/×/g, '*')
                        .replace(/÷/g, '/')
                        .replace(/%/g, '/ 100 *')
                        .replace(/\//g, '%'); // Modulos operation
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
