let round_trip = false;
let seat_class = 'economy';
let dep_loc = '';
let arr_loc = '';
let dep_date;
let return_date;
let currency = 'CAD';

const dep_loc_box = document.getElementById('dep-loc')

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

// Load the search results
document.addEventListener('DOMContentLoaded', (event) => {
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    let old_dep_loc = JSON.parse(localStorage.getItem('dep_loc'));
    let old_arr_loc = JSON.parse(localStorage.getItem('arr_loc'));
    let old_dep_date = JSON.parse(localStorage.getItem('dep_date'));

    const dep_loc_box = document.getElementById('dep-loc');
    const arr_loc_box = document.getElementById('dest-loc');
    const dep_date_box = document.getElementById('dep-date');

    dep_loc_box.innerText = old_dep_loc;
    arr_loc_box.innerText = old_arr_loc;
    dep_date_box.value = old_dep_date

    dep_loc = old_dep_loc;
    arr_loc = old_arr_loc;
    dep_date = old_dep_date;

    // Set the appropriate values to the search text boxes


    if (searchResults) {
        console.log('Loaded search results:', searchResults);
        // Display search results on the page
        displaySearchResults(searchResults);
    } else {
        alert('No search results found in local storage.');
    }
});

// The function that creates the containers for the results
function displaySearchResults(results) {
    const containerWrapper = document.querySelector('.result-container-wrapper');
    
    results.forEach(result => {
        // Create a div for each result
        const resultContainer = document.createElement('div');
        resultContainer.classList.add('result-container');

        // Populate the div with data from the dictionary
        resultContainer.innerHTML = `
            <h4 class="time-1">${result.dep_time}</h4>
            <h4 class="time-2">${result.arr_time}</h4>
            <h5 class="loc-1">${result.dep_id}</h5>
            <h5 class="loc-2">${result.arr_id}</h5>
            <h5 class="duration-1">${result.duration}</h5>
            <h6 class="stops-1">${result.stops}</h6>
            <h3 class="price">${result.price}</h3>
            <hr class="flight-line-1">
            <div class="airline-image">
                <img src="${result.airline_image}"alt="">
            </div>
            <h6 class="airline-label">${result.airline}</h6>
            <div class="button-container">
                <button class="buy-now-button">
                    <span class="plane-icon">✈️</span> Buy Now
                </button>
            </div>
        `;

        // Append the result container to the wrapper
        containerWrapper.appendChild(resultContainer);
    });
};

// The stop filters
document.getElementById('direct-flight-checkbox').addEventListener('click', stopsFilter)
document.getElementById('one-stop-checkbox').addEventListener('click', stopsFilter)
document.getElementById('two-plus-stops-checkbox').addEventListener('click', stopsFilter)

function stopsFilter() {
    // Retrieve the checkbox states
    const directFlightChecked = document.getElementById('direct-flight-checkbox').checked;
    const oneStopChecked = document.getElementById('one-stop-checkbox').checked;
    const twoPlusStopsChecked = document.getElementById('two-plus-stops-checkbox').checked;

    // Retrieve the search results
    const searchResults = JSON.parse(localStorage.getItem('searchResults'));
    
    // Filter the results
    const filteredResults = searchResults.filter(result => {
        if (directFlightChecked && result.stops === "Direct flight") return true;
        if (oneStopChecked && result.stops === "1 stops") return true;
        if (twoPlusStopsChecked && result.stops === "2 stops") return true;
        return false;
    }); 
    console.log(filteredResults)

    // Remove old results
    const resultContainerWrapper = document.querySelector('.result-container-wrapper');
    resultContainerWrapper.innerHTML = '';

    // Display results
    displaySearchResults(filteredResults)

}

// The price filters
document.getElementById("min input-ranges").addEventListener('change', priceFilter)
document.getElementById("max input-ranges").addEventListener('change', priceFilter)

function priceFilter() {
    const minValueInput = document.querySelector('.input-ranges.min');
    const maxValueInput = document.querySelector('.input-ranges.max')
    const minValue = parseInt(minValueInput.value);
    const maxValue = parseInt(maxValueInput.value);
    const priceRange = maxValue - minValue;

    // First update the html code to show the correct, min, max, and range values
    document.getElementById('first').textContent = minValue;
    document.getElementById('second').textContent = maxValue;
    document.getElementById('third').textContent = priceRange;

    const searchResults = JSON.parse(localStorage.getItem('searchResults'));


    // Filter the results based on price
    const filteredResults = searchResults.filter(result => {
        if (result.price_raw >= minValue && result.price_raw <= maxValue) return true;
        return false;
    });

    if (document.getElementById('direct-flight-checkbox').checked === false 
    || document.getElementById('one-stop-checkbox').checked === false
    || document.getElementById("two-plus-stops-checkbox").checked === false) {
        const filteredResults = filteredResults.filter(result => {
            if (directFlightChecked && result.stops === "Direct flight" && result.returning_stops === "Direct flight") return true;
            if (oneStopChecked && result.stops === "1 stops" && result.returning_stops === "1 stops") return true;
            if (twoPlusStopsChecked && result.stops >= "2 stops" && result.returning_stops === '2 stops') return true;
            return false;
        }); 
    }

    // Remove old results
    const resultContainerWrapper = document.querySelector('.result-container-wrapper');
    resultContainerWrapper.innerHTML = '';

    // Display results
    displaySearchResults(filteredResults)
}


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
    }
}


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
if (round_trip === true) {
    document.getElementById('return-date').setAttribute('min', tomorrow);
}

document.getElementById('dep-date').addEventListener('change', depDate);
function depDate() {
    dep_date = document.getElementById('dep-date').value;
    console.log(dep_date)

    const depDateObject = new Date(dep_date);

    if (round_trip ===  true) {
        // Get the next day
        const nextDay = new Date(depDateObject);
        nextDay.setDate(depDateObject.getDate() + 1);
        
        // Format the next day as yyyy-mm-dd
        const nextDayString = nextDay.toISOString().slice(0, 10);
        document.getElementById('return-date').setAttribute('min', nextDayString);
    }
}

if (round_trip === true) {
    document.getElementById('return-date').addEventListener('change', returnDate);
}

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


// The function that displays the loader when the search button is pressed
function displayLoader() {
    var loaderWrapper = document.getElementById('loader-wrapper');
    loaderWrapper.style.display = 'flex'; // Make the loader visible
    setTimeout(function() {
        loaderWrapper.style.opacity = '1'; // Apply transition effect
    }, 10); // Small timeout to trigger the transition
}


document.getElementById('result-container-wrapper').addEventListener('click', buyNow) 

async function buyNow(event) {
    // Added to the parent #results div. It listens for clicks 
    // on the entire container but only reacts to clicks on elements 
    // with the class buy-now-button

    if (event.target.classList.contains('buy-now-button')) {
        // Find the closest parent .result-container div
        const resultDiv = event.target.closest('.result-container');

        // Extract information from the resultDiv
        const flightDetails = {
            dep_time: resultDiv.querySelector('.time-1').innerText,
            arr_time: resultDiv.querySelector('.time-2').innerText,
            dep_id: resultDiv.querySelector('.loc-1').innerText,
            arr_id: resultDiv.querySelector('.loc-2').innerText,
            duration: resultDiv.querySelector('.duration-1').innerText,
            stops: resultDiv.querySelector('.stops-1').innerText,
            price: resultDiv.querySelector('.price').innerText,
            airline: resultDiv.querySelector('.airline-label').innerText,
        };

        console.log(flightDetails);
        
        // Now loop through all the search results till one of the results matches the above flight
        // details, then send the flight token and id to backend to produce a url and redirect
        //  user to said url
        
        const all_results = JSON.parse(localStorage.getItem('searchResults'));

        // Loop through all search results to find the matching flight details
        for (let i = 0; i < all_results.length; i++) {
            const result = all_results[i];
            if (
                result.dep_time === flightDetails.dep_time &&
                result.arr_time === flightDetails.arr_time &&
                result.dep_id === flightDetails.dep_id &&
                result.arr_id === flightDetails.arr_id &&
                result.duration === flightDetails.duration &&
                result.stops === flightDetails.stops &&
                result.airline === flightDetails.airline
                ) {
                // If a matching flight is found, send the flight token and ID to the backend
                const flightToken = result.token;
                const flightID = result.id;
                
                const flight_data = {
                    'token': flightToken,
                    'id': flightID,
                    'currency': currency
                }
                console.log(flight_data)

                displayLoader()

                try {
                    const response = await fetch('https://backendhosting-flighter.onrender.com/grabUrl', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(flight_data)
                    });
                    
                    
                    if (!response.ok) {
                        fadeOutLoader()
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    
                    const data = await response.json();
                    console.log(data)
                    window.open(data.result_url, '_blank');
                    fadeOutLoader()


                } catch(error) {
                    fadeOutLoader()
                    console.error('Error:', error);
                    alert('An error occurred while generating the flight URL.');
                }

                break; // Exit the loop once a match has been found

            }
    }
    }
};


// The search button
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
            'currency': currency
        };

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
            window.location.href = '../Search Results Page/results.html'
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
                alert(result);
                fadeOutLoader()

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
        }   
        
    }   catch (error) {
            console.error('Error during search:', error);
            fadeOutLoader()
        }

    }
}