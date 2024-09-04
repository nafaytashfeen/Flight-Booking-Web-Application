let first_name = ''
let last_name = ''
let email = ''
let password = ''
let confirmed_password = ''

// Update all the information to the variables 

document.getElementById('f1').addEventListener('input', firstNameInput)

function firstNameInput() {
    var name_input = document.getElementById('f1')
    first_name = name_input.value
    console.log(first_name)
}

document.getElementById('f1.2').addEventListener('input', lastNameInput)

function lastNameInput() {
    var lastName_input = document.getElementById('f1.2')
    last_name = lastName_input.value
    console.log(last_name)
}

document.getElementById('f2').addEventListener('input', emailInput)

function emailInput() {
    var email_input = document.getElementById('f2')
    email = email_input.value
}

document.getElementById('f3').addEventListener('input', passwordInput)

function passwordInput() {
    // var password_input = document.getElementById('f3')
    // password = password_input.value
}

document.getElementById('f4').addEventListener('input', confirmPasswordInput)

function confirmPasswordInput() {
    // var confpass_input = document.getElementById('f4')
    // confirmed_password = confpass_input.value
    const errorMessage = document.getElementById('error-message');

    // if (password != confirmed_password) {
    //     errorMessage.style.display = 'inline';
    //     // If the passwords dont match, dispkay the error

    // } else {
    //     errorMessage.style.display = 'none'
    // }
}

// Sign-up button logic
document.getElementById('sign-up-button').addEventListener('click', signUp)

async function signUp(event) {
    event.preventDefault(); // Prevent the form from submitting and reloading the page
    const errorMessage = document.getElementById('error-message');

    // Grab the password and confirmed_password
    var password_input = document.getElementById('f3');
    password = password_input.value;

    var confpass_input = document.getElementById('f4');
    confirmed_password = confpass_input.value;

    // Reset the two variables
    password_input = '';
    confpass_input = '';

    if (first_name === "" || last_name === "" || email === "" || password === "" || confirmed_password === "") {
        alert("One or more fields are not filled out")
        password = '';
        confirmed_password = '';
        // Reset the password variables
        // Handle the case where one or more fields are empty
    
    } else if (password != confirmed_password) {
        errorMessage.style.display = 'inline';
        password = '';
        confirmed_password = '';
        // If the password does not match, do nothing other than display the error
        // Reset the password variables

    } else {
        // The case where the passwords match and the fields are all filled out
        errorMessage.style.display = 'none';
        // const encryptedPassword = CryptoJS.SHA256(password).toString();
        // Going to hash password in backend instead
        const user = {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'password': password,
        };
        // Now that the user data is stored in JSON format, send user to verification page,
        // but first, store the user_data in sessionStorage
        
        first_name = ''
        last_name = ''
        email = ''
        password = ''
        confirmed_password = ''
        // Reset all the variables

        sessionStorage.setItem('user_data_unverified', JSON.stringify(user));
        window.location.href = 'verification.html';
    }
}


