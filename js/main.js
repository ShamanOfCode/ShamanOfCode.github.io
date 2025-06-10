// Simple JS typing effect for subtitle
const subtitle = "Photographer • Developer • Creator";
let i = 0;
function typeWriter() {
    if (i < subtitle.length) {
        document.getElementById("subtitle").innerHTML += subtitle.charAt(i);
        i++;
        setTimeout(typeWriter, 70);
    }
}
window.onload = function() {
    typeWriter();
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
};
