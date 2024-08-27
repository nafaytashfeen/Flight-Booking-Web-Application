let round_trip = true;
let seat_class = 'economy';
let dep_loc = '';
let arr_loc = '';
let dep_date;
let return_date;
let currency = 'CAD';
let signed_in = JSON.parse(sessionStorage.getItem('signed_in'));


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

// Pressing the Register button
document.getElementById('register').addEventListener('click', () => {
    window.location.href = "../Account Pages/register.html";
});

// Pressing the Log In button
document.getElementById('signin').addEventListener('click', () => {
    window.location.href = "../Account Pages/signin.html";
});

// The code for selecting between round trip or one-way flights
document.getElementById('round-trip').addEventListener('click', () => roundTrip('round-trip'));
document.getElementById('one-way').addEventListener('click', () => oneWay('one-way'));

function roundTrip(optionId) {
    const round = document.getElementById(optionId);
    const one = document.getElementById('one-way');
    if (!round_trip) {
        round_trip = true
        round.classList.add('selected')
        one.classList.remove('selected')
        
        // Add the return date div back, if not already there
        const returnDateDiv = document.querySelector('.filter-containers');
        if (returnDateDiv && !document.querySelector('.filter.arr-date')) {
        const newDiv = document.createElement('span');
        newDiv.classList.add('filter', 'arr-date');
        newDiv.style.fontFamily = 'Nunito';
        newDiv.setAttribute('data-placeholder', 'Return (yyyy/mm/dd)');
        
        newDiv.innerHTML = `
            <label for="Return: " style="font-family: Nunito; margin-right: 10px; color: #999;">Return</label>
            <input type="date" style="border: none;" id="return-date">
        `;
        
        returnDateDiv.appendChild(newDiv);
        }
    }

}

function oneWay(optionId) {
    const optionElement = document.getElementById(optionId);
    const round = document.getElementById('round-trip')
    if (round_trip) {
        round_trip = false
        optionElement.classList.add('selected')
        round.classList.remove('selected')
    }

    const returnDateDiv = document.querySelector('.filter.arr-date');
    if (returnDateDiv) {
        returnDateDiv.remove();
    }}

// The code for the seat class and saving it to the variable
document.getElementById('seat_class').addEventListener('change', seatClassChange)

function seatClassChange() {
    var dropdown = document.getElementById('seat_class')
    seat_class = dropdown.value
    console.log(seat_class)
}

// The code for the 4 filters
document.getElementById('dep-loc').addEventListener('input', depLoc)

function depLoc() {
    dep_loc = document.getElementById('dep-loc').textContent.trim();
    console.log(dep_loc)
}

document.getElementById('dest-loc').addEventListener('input', arrLoc)

function arrLoc() {
    arr_loc = document.getElementById('dest-loc').textContent.trim();
    console.log(arr_loc)
}

const today = new Date();
const year = today.getFullYear();
let month = today.getMonth() + 1;
let day = today.getDate();
tomday = day + 1;

// Add leading zeros if needed
if (month < 10) {
  month = '0' + month;
}
if (day < 10) {
  day = '0' + day;
}

if (tomday < 10) {
    tomday = '0' + tomday;
}
const todayday = `${year}-${month}-${day}`;
const tomorrow = `${year}-${month}-${tomday}`;
document.getElementById('dep-date').setAttribute('min', todayday);
document.getElementById('return-date').setAttribute('min', tomorrow);


document.getElementById('dep-date').addEventListener('change', depDate);
function depDate() {
    dep_date = document.getElementById('dep-date').value;
    console.log(dep_date)

    const depDateObject = new Date(dep_date);

    // Get the next day
    const nextDay = new Date(depDateObject);
    nextDay.setDate(depDateObject.getDate() + 1);
    
    // Format the next day as yyyy-mm-dd
    const nextDayString = nextDay.toISOString().slice(0, 10);
    document.getElementById('return-date').setAttribute('min', nextDayString);

}

document.getElementById('return-date').addEventListener('change', returnDate);
function returnDate() {
    return_date = document.getElementById('return-date').value;
    console.log(return_date)
}

// The code for getting the right currency
document.getElementById('currency').addEventListener('change', currenctCurrency);
function currenctCurrency() {
    var dropdown = document.getElementById('currency')
    currency = dropdown.value
}

// Scrolling Animation
function scrollToTop() {
    const scrollDuration = 450; // Duration of the scroll animation in milliseconds
    const scrollStep = -window.scrollY / (scrollDuration / 15); // Scroll distance per frame

    // Function to perform scrolling animation
    const scrollInterval = setInterval(() => {
        if (window.scrollY !== 0) {
            window.scrollBy(0, scrollStep); // Scroll up by scrollStep
        } else {
            clearInterval(scrollInterval); // Clear interval when at the top
        }
    }, 15); // 15ms per frame for smoother animation
}

// The 4 destination buttons
document.getElementById('pd1').addEventListener('click', pd1)
function pd1() {
    scrollToTop();
    const arr_loc_box = document.getElementById('dest-loc');
    arr_loc_box.innerText = "Los Angeles"
    arr_loc = "Los Angeles"
}

document.getElementById('pd2').addEventListener('click', pd2)
function pd2() {
    scrollToTop();
    const arr_loc_box = document.getElementById('dest-loc');
    arr_loc_box.innerText = "New York"
    arr_loc = "New York"
}

document.getElementById('pd3').addEventListener('click', pd3)
function pd3() {
    scrollToTop();
    const arr_loc_box = document.getElementById('dest-loc');
    arr_loc_box.innerText = "Honk Kong"
    arr_loc = "Hogn Kong"
}

document.getElementById('pd4').addEventListener('click', pd4)
function pd4() {
    scrollToTop();
    const arr_loc_box = document.getElementById('dest-loc');
    arr_loc_box.innerText = "London"
    arr_loc = "London"
}


// The function that displays the loader when the search button is pressed
function displayLoader() {
    var loaderWrapper = document.getElementById('loader-wrapper');
    loaderWrapper.style.display = 'flex'; // Make the loader visible
    setTimeout(function() {
        loaderWrapper.style.opacity = '1'; // Apply transition effect
    }, 10); // Small timeout to trigger the transition
}


// The search button (most important lowkey)
document.getElementById('search-button').addEventListener('click', searchResults)

async function searchResults() {
    if (dep_loc === '') {
        alert("Please choose a valid departure location in the format (city)")
    }

    else if (arr_loc === '') {
        alert("Please choose a valid arrival location in the format (city)")
    }

    else if (dep_date === undefined || return_date === undefined && round_trip === true) {
        alert("Please choose a valid departure or return date")
    }

    else if (dep_date === undefined && round_trip === false) {
        alert("Please choose a valid departure date")
    }

    else if (round_trip === true) {

        const data = {
            'dep_loc': dep_loc, 
            'arr_loc': arr_loc, 
            'dep_date': dep_date, 
            'return_date': return_date, 
            'seat_class': seat_class, 
            'currency': currency,
            'round_trip': true
        };
        console.log(data)

        // Display the loader
        displayLoader()

        try {
            const response = await fetch('https://backendhosting-flighter.onrender.com/api/search', {

                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log("tried calling the API")
            
            if (!response.ok) {
                fadeOutLoader()
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Search results:', result);

            if (typeof result === 'string') {
                fadeOutLoader()
                alert(result);

        }   else {
            // Store the results in storage
            localStorage.setItem('searchResults', JSON.stringify(result));
            localStorage.setItem('dep_loc', JSON.stringify(dep_loc))
            localStorage.setItem('arr_loc', JSON.stringify(arr_loc))
            localStorage.setItem('dep_date', JSON.stringify(dep_date))
            localStorage.setItem('return_date', JSON.stringify(return_date))

            
            // Send the search_data to backend
            if (signed_in) {
                user_email = JSON.parse(sessionStorage.getItem('user_email'));
                search_data = {
                    "user_email": user_email,
                    'dep_loc': dep_loc,
                    'arr_loc': arr_loc,
                    'dep_date': dep_date,
                    'return_date': return_date
                }

                // Send the data to backend
                
                try {
                    const response2 = await fetch('https://backendhosting-flighter.onrender.com/add_to_recent_searches', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(search_data)
                    });
                } catch (error) {
                    console.log("Something went wrong...")
                    // Do nothing if it goes wrong and continue as normal
                }
            }

            // Take them to the search result page
            window.location.href = '../Search Results Page/results.html'
            console.log('wha')
        }   
        
    }   catch (error) {
            fadeOutLoader()
            console.error('Error during search:', error);
        }

    }

    else if (round_trip === false) {
        const data = {
            'dep_loc': dep_loc, 
            'arr_loc': arr_loc, 
            'dep_date': dep_date, 
            'return_date': return_date, 
            'seat_class': seat_class, 
            'currency': currency,
            'round_trip': false
        };
        console.log(data)

        // Display the loader
        displayLoader()

        try {
            const response = await fetch('https://backendhosting-flighter.onrender.com/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log("tried calling the API")
            
            if (!response.ok) {
                fadeOutLoader()
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('Search results:', result);

            if (typeof result === 'string') {
                fadeOutLoader()
                alert(result);
        }   else {
            // Store the results in storage
            localStorage.setItem('searchResults', JSON.stringify(result));
            localStorage.setItem('dep_loc', JSON.stringify(dep_loc))
            localStorage.setItem('arr_loc', JSON.stringify(arr_loc))
            localStorage.setItem('dep_date', JSON.stringify(dep_date))

            if (signed_in) {
                // Send the search_data to backend
                
                user_email = JSON.parse(sessionStorage.getItem('user_email'));
                search_data = {
                    "user_email": user_email,
                    'dep_loc': dep_loc,
                    'arr_loc': arr_loc,
                    'dep_date': dep_date,
                    'return_date': return_date
                }

                // Send the data to backend
                
                try {
                    const response2 = await fetch('https://backendhosting-flighter.onrender.com/add_to_recent_searches', {

                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(search_data)
                    });
                } catch (error) {
                    console.log("Something went wrong...")
                    // Do nothing if it goes wrong and continue as normal
                }
            }

            // Take them to the search result page
            window.location.href = '../Search Results Page/results-OW.html'
            console.log('wha')
        }   
        
    }   catch (error) {
            fadeOutLoader()
            console.error('Error during search:', error);
        }

    }

}