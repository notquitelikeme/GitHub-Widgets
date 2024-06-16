// Function to dynamically style iframes by class name
function styleIframesByClass(className, height, width) {
    var iframes = document.getElementsByClassName(className);

    for (var i = 0; i < iframes.length; i++) {
        var iframe = iframes[i];

        // Set the initial styles for each iframe
        iframe.style.height = height; // Example height
        iframe.style.width = width;   // Example width
        iframe.style.border = 'none'; // Example border style

        // Additional CSS styles if needed
        iframe.style.display = 'block';  // Ensure it's displayed as a block element
    }
}

// Call the functions when the window loads
window.onload = function() {
    styleIframesByClass('Frame', '550px', '20%');
    styleIframesByClass('PFrame', '310px', '100%');
};
