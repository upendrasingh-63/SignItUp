// script.js
window.onload = function () {
     // Firebase configuration
     const firebaseConfig = {
        apiKey: "AIzaSyAUI8TZ4LnjuydHBVXlshF3emXn67kVYkE",
        authDomain: "signatureapp-4a3f4.firebaseapp.com",
        projectId: "signatureapp-4a3f4",
        storageBucket: "signatureapp-4a3f4.appspot.com",
        messagingSenderId: "154349649697",
        appId: "1:154349649697:web:cbec4a6b1533ce707e0860",
        measurementId: "G-B51T7KYPTG"
    };

    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    // Reference to the visitor count and download count in Firebase
    const visitorCountRef = database.ref('visitorCount');
    const downloadCountRef = database.ref('downloadCount');

    // Increment visitor count on page load
    visitorCountRef.transaction((currentCount) => {
        return (currentCount || 0) + 1;
    });

    function incrementDownloadCount() {
        downloadCountRef.transaction((currentCount) => {
            return (currentCount || 0) + 1;
        });
    }

    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const backgroundColorPicker = document.getElementById('backgroundColorPicker');
    const transparentBackgroundCheckbox = document.getElementById('transparentBackground');
    const clearButton = document.getElementById('clearButton');
    const saveButton = document.getElementById('saveButton');

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let drawing = false;

    function startDrawing(e) {
        drawing = true;
        draw(e);
    }

    function stopDrawing() {
        drawing = false;
        ctx.beginPath(); // Reset the path
    }

    function draw(e) {
        if (!drawing) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = colorPicker.value;

        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    }

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseout', stopDrawing);

    transparentBackgroundCheckbox.addEventListener('change', () => {
        backgroundColorPicker.disabled = transparentBackgroundCheckbox.checked;
    });

    clearButton.addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    saveButton.addEventListener('click', () => {
        const dataURL = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'signature.png';
        link.click();
        incrementDownloadCount();
    });
    // Display visitor and download counts
    visitorCountRef.on('value', (snapshot) => {
        document.getElementById('visitorCount').innerText = snapshot.val();
    });

    downloadCountRef.on('value', (snapshot) => {
        document.getElementById('downloadCount').innerText = snapshot.val();
    });
};
