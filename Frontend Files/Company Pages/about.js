// Dont display the login/register button if signed in
document.addEventListener('DOMContentLoaded', (event) => {
    try{
        const signed_in = JSON.parse(sessionStorage.getItem('signed_in'));
        if (signed_in === true) {
            let register_button = document.getElementById('register');
            let signin_button = document.getElementById('signin');
            
            register_button.innerHTML = "";
            register_button.outerHTML = "";
            signin_button.innerHTML = "";
            signin_button.outerHTML = "";
        }

    } catch(error) {
        // do nothing
        
    }
});

// Fade out the loader once the page is loaded
document.addEventListener("DOMContentLoaded", fadeOutLoader)
function fadeOutLoader() {
    var loader = document.getElementById('loader-wrapper');
    loader.style.transition = 'opacity 1s ease';
    loader.style.opacity = '0';

    // Optional: Remove the loader from the DOM after the transition
    setTimeout(function() {
        loader.style.display = 'none';
    }, 1000); // 1000 milliseconds equals the duration of the transition
}


// Pressing the Register button
document.getElementById('register').addEventListener('click', () => {
    window.location.href = "../Account Pages/register.html";
});

// Pressing the Log In button
document.getElementById('signin').addEventListener('click', () => {
    window.location.href = "../Account Pages/signin.html";
});
