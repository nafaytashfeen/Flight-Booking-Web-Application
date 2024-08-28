# Flight-Booking-Web-Application

## This flight booking web application is a platform designed to allow users to search, compare, and book flights from various airlines. It offers a user-friendly interface, making it easy for travelers to find the best deals and manage their bookings.


### Demo: https://frontend-hosting-flighter.vercel.app/Homepage/homepage.html

Features:

- Round Trip or One-Way Flights: Choose between booking a round trip or a one-way flight.

- Filtering Options: Filter flight results by price or number of stops to find the deal that matches user needs

- Direct Airline Purchase Links: Redirects user directly to the airline's purchase page for easy booking

- Sign-features (Email Authentication): Allows users to register/sign-in to save recent searches for quick access later


How it works:

Frontend Setup: 
- The frontend is built in HTML/CSS. The layout is designed to be resposive and work smoothly across all devices. CSS is used for styling with a focus on a clean user-friendly design
- JavaScript is used to handle page interactions, such as form submissions and filtering search results. The search functionality is integrated with the backend API, allowing users to get the results they need. 
- The frontend is hosted on Vercel. Demo is found above.


Backend Setup:
- The backend is powered by Python, using the Flask framework. 
- The backend uses RESTful API endpoints to handle important operations such as flight search queries and user authentication. 
- The backend interacts with a PostgreSQL database using the psycogp2 library. The database is used to store user data, flight queries, and other important information.
- Email Authentication is implemented by sending a verification code to the user's email upon registering for an account
- The backend is deployed on Render for high scalability.

How to use:

1. Clone the repository
Type this in the terminal:
`git clone https://github.com/nafaytashfeen/Flight-Booking-Web-Application.git`

2. Navigate to the project directory
Type this in the terminal:
`cd Flight-Booking-Web-Application`

3. Install required dependancies
These are found in the file requirements.txt. Type this in the terminal:
`pip install -r requirements.txt`

4. Configure API Keys
You will need a SkyScanner API key for the backend
Input your SkyScanner API key in "Backend Files/searching.py" on lines <28>, <68>, <152>, <182>, <246>

5. Configure Database
Input Database details in the function <create_connection> in "Backend Files/searching.py" on lines <322-326>.

6. Run the backend server
If you want to run the backend server locally, this can be done by running the file "Backend Files/searching.py" or typing this in the terminal: `python searching.py`

7. Access the frontend
Open the frontend by navigating to the appropriate HTML file in your browser or by serving it with a local server like 'Live Server' in VSCode.

8. Explore the features and enjoy