// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBKL7uDtFzLKmBayG_kWtXtB6efD3doUL0",
    authDomain: "guro-mary-portal.firebaseapp.com",
    projectId: "guro-mary-portal",
    databaseURL: "https://guro-mary-portal-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "guro-mary-portal.firebasestorage.app",
    messagingSenderId: "728386805647",
    appId: "1:728386805647:web:6a5c9c65190583858275fa",
    measurementId: "G-Z3MZJPXE0J"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Helper Function: Get formatted Time for the Status Bar
function getTimestamp() {
    return new Date().toLocaleString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
    });
}

// 2. Login Logic
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;
        
        // Credentials check
        if ((user === 'Michael' && pass === 'PinoyStudy2026') || 
            (user === 'GuroMary' && pass === 'TagalogExpert')) {
            
            // Security: Set session flag
            sessionStorage.setItem('isLoggedIn', 'true');
            window.location.href = 'dashboard.html';
        } else {
            const errorMsg = document.getElementById('message');
            if (errorMsg) errorMsg.textContent = 'Invalid credentials. Access Denied.';
        }
    });
}

// 3. Logout Logic (Updated for your new Paalam page)
function logout() {
    sessionStorage.clear(); // Wipe the session
    window.location.href = 'logout.html'; // Redirect to the goodbye page
}

// 4. Dashboard Logic
if (window.location.pathname.includes('dashboard.html')) {
    
    // Security Guard: Check if user is authenticated
    if (!sessionStorage.getItem('isLoggedIn')) {
        window.location.href = 'index.html';
    }

    const homeworkBox = document.getElementById('homeworkText');
    const feedbackBox = document.getElementById('teacherNotes');
    const hwTimeDisplay = document.getElementById('homeworkTime');
    const fbTimeDisplay = document.getElementById('feedbackTime');

    // SYNC FROM CLOUD (Real-time Listener)
    database.ref('studyHub/').on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Load text content
            if (data.homework) homeworkBox.value = data.homework;
            if (data.feedback) feedbackBox.value = data.feedback;
            
            // Update Status Bar timestamps
            if (data.lastHomeworkUpdate) {
                hwTimeDisplay.textContent = "Student Sync: " + data.lastHomeworkUpdate;
            } else {
                hwTimeDisplay.textContent = "Student Sync: --";
            }
            
            if (data.lastFeedbackUpdate) {
                fbTimeDisplay.textContent = "Teacher Sync: " + data.lastFeedbackUpdate;
            } else {
                fbTimeDisplay.textContent = "Teacher Sync: --";
            }
        }
    });

    // SUBMIT HOMEWORK (Michael's Button)
    document.querySelector('.action-btn')?.addEventListener('click', () => {
        const time = getTimestamp();
        database.ref('studyHub/').update({ 
            homework: homeworkBox.value, 
            lastHomeworkUpdate: time 
        }).then(() => alert("Homework successfully saved at " + time));
    });

    // POST FEEDBACK (Guro Mary's Button)
    document.querySelector('.action-btn.secondary')?.addEventListener('click', () => {
        const time = getTimestamp();
        database.ref('studyHub/').update({ 
            feedback: feedbackBox.value, 
            lastFeedbackUpdate: time 
        }).then(() => alert("Feedback posted at " + time));
    });
}