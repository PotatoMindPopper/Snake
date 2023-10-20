// Function to enable dark mode
function enableDarkMode() {
    console.log("dark mode");
    document.body.classList.add("dark-mode");

    // Update the settings dropdown
    document.getElementById("lightMode").style.display = "block";
    document.getElementById("darkMode").style.display = "none";

    // Save the current state of the settings
    localStorage.setItem("darkMode", "true");
}

// Function to enable light mode
function enableLightMode() {
    console.log("light mode");
    document.body.classList.remove("dark-mode");

    // Update the settings dropdown
    document.getElementById("darkMode").style.display = "block";
    document.getElementById("lightMode").style.display = "none";

    // Save the current state of the settings
    localStorage.setItem("darkMode", "false");
}

// Function to reset focus mode settings
function reset() {
    console.log("reset");

    // Fix dark mode (in case it's broken)
    fixDarkMode();

    // Enable light mode
    enableLightMode();

    // Remove dark mode
    localStorage.removeItem("darkMode");
}

// Function to fix dark mode
function fixDarkMode() {
    console.log("fix dark mode");

    // Check the current state of the settings
    const isDarkModeEnabled = localStorage.getItem("darkMode") === "true";
    const bodyHasDarkModeClass = document.body.classList.contains("dark-mode");

    if (isDarkModeEnabled !== bodyHasDarkModeClass) {
        if (isDarkModeEnabled) {
            // Dark mode is enabled, but the body class is not set
            document.body.classList.add("dark-mode");
        } else {
            // Dark mode is disabled, but the body class is set
            document.body.classList.remove("dark-mode");
        }
    }

    // Update the settings dropdown
    document.getElementById("darkMode").style.display = isDarkModeEnabled ? "none" : "block";
    document.getElementById("lightMode").style.display = isDarkModeEnabled ? "block" : "none";
}

// Check if dark mode is enabled
const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDarkModeInStorage = localStorage.getItem("darkMode") === "true";

if (isDarkModeInStorage || userPrefersDark) {
    enableDarkMode();
} else {
    enableLightMode();
}

// Add event listeners to buttons
document.getElementById("darkMode").addEventListener("click", enableDarkMode);
document.getElementById("lightMode").addEventListener("click", enableLightMode);
document.getElementById("reset").addEventListener("click", reset);
