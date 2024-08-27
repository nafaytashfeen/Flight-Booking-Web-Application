let email = ''
let password = ''

// Temporarily store the input email

document.getElementById('f1').addEventListener('input', emailInput)

function emailInput() {
    var email_input = document.getElementById('f1')
    email = email_input.value
}

// Temporarily store the input password
document.getElementById('f2').addEventListener('input', passwordInput)

function passwordInput() {
    // var password_input = document.getElementById('f2')
    // password = password_input.value
}

// Signin button logic

document.getElementById('sign-in-button').addEventListener('click', signIn)

async function signIn(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
    const errorMessage = document.getElementById('error-message');
    
    var password_input = document.getElementById('f2')
    password = password_input.value
    // Grab the password and reset the input var
    password_input = ''

    if (email === "" || password === '') {
        alert("One or more fields are not filled out")
        password = ''
        // Handle the case where one or more fields are empty

    } else {
        // Begin by doing email lookup in the Database
        const encryptedPassword = CryptoJS.SHA256(password).toString();

        const user = {
            'email': email,
            'password': encryptedPassword
        }
        // Now that the user data is stored in JSON format, send it to backend 
        // for credential lookup

        try {
            const response = await fetch('https://backendhosting-flighter.onrender.com/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(user)
            });
            // Send to database and try to login user
            const data = await response.json();
        
            if (data.success) {
                // Reset all the variables
                errorMessage.style.display = 'none';

                password = '';
                // Reset the variables

                sessionStorage.setItem("signed_in", JSON.stringify(true));
                sessionStorage.setItem("user_email", JSON.stringify(email))
                email = '';
                window.location.href = '../Homepage/homepage.html'
            }
            else {
                errorMessage.style.display = 'inline';
            }

        } catch (error) {
            console.error('Error:', error);
            password = ''
            alert('An error occurred while trying to login the user.');
        }
    }
}

