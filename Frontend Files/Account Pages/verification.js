let user_data;
let encrypted_verification_code = '';
let input_code = '';
let countdown;

// This function sets a timer for 3 minutes before the verification code expires
// the timer continues even if the page is reloaded
document.addEventListener('DOMContentLoaded', startTimer);

function startTimer() {
    const timerElement = document.getElementById('timer');
    const totalTime = 180; // 3 minutes in seconds
    let endTime = sessionStorage.getItem('timerEndTime');

    if (!endTime) {
        endTime = new Date().getTime() + totalTime * 1000;
        sessionStorage.setItem('timerEndTime', endTime);
    }

    if (countdown) {
        clearInterval(countdown); // Clear any existing interval
    }

    countdown = setInterval(() => {
        const now = new Date().getTime();
        const timeLeft = Math.max(0, (endTime - now) / 1000);

        if (timeLeft <= 0) {
            clearInterval(countdown);
            timerElement.innerHTML = '00:00';
            sessionStorage.removeItem('timerEndTime');
            encrypted_verification_code = '';
            alert("Your verification code has expired. Please request a new code.");
        } else {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = Math.floor(timeLeft % 60);
            timerElement.innerHTML = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// This function resets the timer
function resetTimer() {
    const totalTime = 180; // 3 minutes in seconds
    const newEndTime = new Date().getTime() + totalTime * 1000;
    sessionStorage.setItem('timerEndTime', newEndTime);
    startTimer();
}


document.addEventListener('DOMContentLoaded', pageLoaded);

async function pageLoaded(){
    // Grab the user_data_unverified from session storage
    user_data = JSON.parse(sessionStorage.getItem('user_data_unverified'));
    sessionStorage.removeItem('user_data_unverified')
    // Store the data then remove it immediately from sessionStorage

    try {
        const response = await fetch('https://backendhosting-flighter.onrender.com/send_verification_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_data)
        });        

        let data = await response.json();

        if (response.ok) {
            let verification_code = data.verification_code;
            encrypted_verification_code = CryptoJS.SHA256(verification_code).toString();
            // Store the encrypted code or handle it as needed
            
            data = '';
            verification_code = '';
            // Clear the variables

        } else {
            console.error('Error:', data);
            data = ''
            // Handle the error
        }
        
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while verifying the user.');
    }

};


// For each of the input boxes (1-5) auto-tab to the next box once a number is typed in
document.getElementById('input1').addEventListener('input', tabForward);
document.getElementById('input2').addEventListener('input', tabForward);
document.getElementById('input3').addEventListener('input', tabForward);
document.getElementById('input4').addEventListener('input', tabForward);
document.getElementById('input5').addEventListener('input', tabForward);

function tabForward(event) {
    const currentInput = event.target;
    const nextInput = currentInput.nextElementSibling;

    if (currentInput.value.length === currentInput.maxLength) {
        if (nextInput && nextInput.tagName === 'INPUT') {
            nextInput.focus();
        }
    };
};


// The logic for verifying the user's email
document.getElementById('verifyButton').addEventListener('click', verifyUser);

async function verifyUser(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
    input_code = '';
    for (let i = 1; i <= 6; i++) {
        input_code += document.getElementById(`input${i}`).value;
    }

    let hashed_input_code = CryptoJS.SHA256(input_code).toString();

    if (hashed_input_code === encrypted_verification_code) {
        // Register the User
        try {
            const response = await fetch('https://backendhosting-flighter.onrender.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user_data)
            });
            // Send to database and try to register user
            const data = await response.json();

            if (data.success) {
                alert('User registered successfully');
                // Reset all the variables
                
                window.location.href = 'signin.html'
            } else {
                alert('Error registering user: Email already in use');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while registering the user.');
        }
   
    } else {
        if(input_code.length < 6) {
            alert('Not all fields are filled out')
        
        } else {
        alert('Wrong code inputted, please try again')
        }
    }

}

// Resend button logic
document.getElementById('resendBtn').addEventListener('click', resendVerf);

async function resendVerf(event) {
    // This function resends the verificaiton code to the email while 
    // invalidating the previously sent code

    event.preventDefault(); // Prevent the form from submitting and reloading the page
    
    try {
        const response = await fetch('https://backendhosting-flighter.onrender.com/send_verification_email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user_data)
        });        

        let data = await response.json();

        if (response.ok) {
            resetTimer()
            // Reset the timer
            let verification_code = data.verification_code;
            encrypted_verification_code = CryptoJS.SHA256(verification_code).toString();
            // Store the encrypted code or handle it as needed
            
            data = '';
            verification_code = '';
            // Clear the variables

        } else {
            console.error('Error:', data);
            data = ''
            // Handle the error
        }
        
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while verifying the user.');
    }
}