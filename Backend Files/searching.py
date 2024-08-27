from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from iata import city_to_iata
from citytoiata import write_dictionary
import pymysql
from signupIn import create_user, credentials_lookup, email_verification
from recent_searches import id_lookup, add_recent_search
import psycopg2
from psycopg2 import sql


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


def search_results(departure_loc: str, arrival_loc: str, 
                   dep_date: str, return_date: str, seat_class: str, currency: str) -> list[dict[str, str]]:
    """
    This function gets the search results for a round trip flight using a SkyScanner API
    """
    # Begin by getting the departure locations id and the arrival locations id and then make the second
    # API call for round trip flights
    try:
        url = "https://skyscanner80.p.rapidapi.com/api/v1/flights/auto-complete"

        headers = {
            "x-rapidapi-key": "API-KEY-GOES-HERE",
            "x-rapidapi-host": "skyscanner80.p.rapidapi.com"
        }

        params1 = {'query': departure_loc}
        params2 = {'query': arrival_loc}
        response = requests.get(url, headers=headers, params=params1)
        response2 = requests.get(url, headers=headers, params=params2)
        dep_data = response.json()
        arr_data = response2.json()

        dep_id = dep_data['data'][0]['id']
        arr_id = arr_data['data'][0]['id']
        print(dep_id, arr_id)

        # Now make the actual API Call to get the flight data

        url = "https://skyscanner80.p.rapidapi.com/api/v1/flights/search-roundtrip"

        # For some reason i have to hard code the currency, it dosent work if i simply put the 
        # <currency> variable
        if currency == "CAD":
            querystring = {
                "fromId":dep_id,
                "toId":arr_id,
                "departDate": dep_date,
                "returnDate": return_date,
                "adults":"1",
                "cabinClass": seat_class,
                "currency": "CAD",
                "market":"US",
                "locale":"en-US"}
        
        else:
            querystring = { "fromId":dep_id, "toId":arr_id, "departDate": dep_date, "returnDate": return_date, "adults":"1", "cabinClass": seat_class,
                "currency": "USD",
                "market":"US",
                "locale":"en-US"}

        headers = {
            "x-rapidapi-key": "API-KEY-GOES-HERE",
            "x-rapidapi-host": "skyscanner80.p.rapidapi.com"
        }

        response = requests.get(url, headers=headers, params=querystring)

        json_data = response.json()

        print(json_data)

        # Begin building the dictionary with all the data

        all_results = []

        for result in json_data['data']['itineraries']:
            dic_result = {}
            dic_result['token'] = json_data['data']['token'] # The token for this search
            dic_result['id'] = result['id'] # The id of this result
            dic_result['price'] = result['price']['formatted'] # The price of the result, as an str
            dic_result['price_raw'] = result['price']['raw'] # The raw price of the result, as an int
            dic_result['dep_id'] = result['legs'][0]['origin']['id'] # The IATA code for the dep loc
            dic_result['arr_id'] = result['legs'][0]['destination']['id']
            stops = result['legs'][0]['stopCount']

            if int(stops) == 0:
                stops = "Direct flight"
            else:
                stops = str(stops) + " stops"

            dic_result['stops'] = stops # The number of stops in dep_dest to arr_dest (starting from 1)
            duration = result['legs'][0]['durationInMinutes']
            hours = int(duration) // 60
            mins = int(duration) % 60
            duration = f"{hours}hrs {mins}mins"

            dic_result['duration'] = duration # The duration of the flight in {hours} {mins}
            dic_result['dep_time'] = result['legs'][0]['departure'][-8:] # The time of departure
            dic_result['arr_time'] = result['legs'][0]['arrival'][-8:] # The time of arrival
            dic_result['airline'] = result['legs'][0]['carriers']['marketing'][0]['name'] # The airline name
            dic_result['airline_image'] = result['legs'][0]['carriers']['marketing'][0]['logoUrl'] # The logo of the airline
            # The following is the same but for the returning flight
            dic_result['returning_dep_id'] = result['legs'][1]['origin']['id'] 
            dic_result['returning_arr_id'] = result['legs'][1]['destination']['id']
            stops = result['legs'][1]['stopCount']
            if int(stops) == 0:
                stops = "Direct flight"
            else:
                stops = str(stops) + " stops"
            dic_result['returning_stops'] = stops
            duration = result['legs'][1]['durationInMinutes']
            hours = int(duration) // 60
            mins = int(duration) % 60
            duration = f"{hours}hrs {mins}mins"

            dic_result['returning_duration'] = duration # The duration of the flight in {hours} {mins}
            dic_result['returning_dep_time'] = result['legs'][1]['departure'][-8:]
            dic_result['returning_arr_time'] = result['legs'][1]['arrival'][-8:]
            dic_result['returning_airline'] = result['legs'][1]['carriers']['marketing'][0]['name']
            dic_result['returning_airline_image'] = result['legs'][1]['carriers']['marketing'][0]['logoUrl']
            all_results.append(dic_result)
        if len(all_results) > 0:
            return all_results

        else: # In case the API does not have any results for the input cities
            return "We could not find any results for these cities, please try again"
    
    except KeyError: # In the case of the city is not found in the city_to_iata dict
        all_results = "We cannot find this city in our data base, please try again."
        return all_results
    
    except TypeError: # In the case that results arent found for this seat class
        all_results = "We cannot find any results with this cabin class, please try a different one"
        return all_results


def search_results_ow(departure_loc: str, arrival_loc: str, dep_date: str, seat_class: str, currency: str) -> list[dict[str, str]]:
    """
    This function gets the results for one way trips using a  skyscanner API.
    """
    # Begin by getting the departure locations id and the arrival locations id and then make the second
    # API call for one way flights
    url = "https://skyscanner80.p.rapidapi.com/api/v1/flights/auto-complete"

    headers = {
        "x-rapidapi-key": "API KEY GOES HERE",
        "x-rapidapi-host": "skyscanner80.p.rapidapi.com"
    }

    params1 = {'query': departure_loc}
    params2 = {'query': arrival_loc}
    response = requests.get(url, headers=headers, params=params1)
    response2 = requests.get(url, headers=headers, params=params2)
    dep_data = response.json()
    arr_data = response2.json()
    
    dep_id = dep_data['data'][0]['id']
    arr_id = arr_data['data'][0]['id']
    print(dep_id, arr_id)

    # Now make the one-way flight API call

    url = "https://skyscanner80.p.rapidapi.com/api/v1/flights/search-one-way"

    querystring = {
        "fromId": dep_id,
        "toId": arr_id, 
        "departDate": dep_date, 
        "adults":"1",
        "cabinClass": seat_class,
        "currency": "CAD",
        "market":"US", 
        "locale":"en-US"}

    headers = {
        "x-rapidapi-key": "API KEY GOES HERE",
        "x-rapidapi-host": "skyscanner80.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    json_data = response.json()
    # Now that we have the results, begin formulating the data
    
    all_results = []

    for result in json_data['data']['itineraries']:
        dic_result = {}
        dic_result['token'] = json_data['data']['token'] # The token for this search
        dic_result['id'] = result['id'] # The id of this result
        dic_result['price'] = result['price']['formatted'] # The price of the result, as a str
        dic_result['price_raw'] = result['price']['raw'] # The raw price of the result, as an int
        # elif currency == 'USD':
        #     dic_result['price'] = "USD $" + str(result['price']['raw'])
        # elif currency == 'EUR':
        #     dic_result['price'] = "EUR €" + str(result['price']['raw'])
        # elif currency == 'JPY':
        #     dic_result['price'] = "JPY ¥" + str(result['price']['raw']) 
        dic_result['dep_id'] = result['legs'][0]['origin']['id'] # The IATA code for the dep loc
        dic_result['arr_id'] = result['legs'][0]['destination']['id']
        stops = result['legs'][0]['stopCount']
        if int(stops) == 0:
            stops = "Direct flight"
        else:
            stops = str(stops) + " stops"
        dic_result['stops'] = stops # The number of stops in dep_dest to arr_dest (starting from 1)
        duration = result['legs'][0]['durationInMinutes']
        hours = int(duration) // 60
        mins = int(duration) % 60
        duration = f"{hours}hrs {mins}mins"

        dic_result['duration'] = duration # The duration of the flight in {hours} {mins}
        dic_result['dep_time'] = result['legs'][0]['departure'][-8:] # The time of departure
        dic_result['arr_time'] = result['legs'][0]['arrival'][-8:] # The time of arrival
        dic_result['airline'] = result['legs'][0]['carriers']['marketing'][0]['name'] # The airline name
        dic_result['airline_image'] = result['legs'][0]['carriers']['marketing'][0]['logoUrl'] # The logo of the airline
        all_results.append(dic_result)
    
    if len(all_results) > 0:
            return all_results

    else: # In case the API does not have any results for the input cities
        return "We could not find any results for these cities on these dates, please try again"


def search_url(flight_token: str, flight_id: str, currency: str) -> dict[str, str]:
    """
    This function grabs a flights purchase link given the token and id, and optionally the currency
    """

    try:
        url = "https://skyscanner80.p.rapidapi.com/api/v1/flights/detail"

        if currency == 'USD':
            querystring = {"itineraryId":flight_id, "token":flight_token, "currency":"USD","market":"US","locale":"en-US"}

        else: 
            querystring = {"itineraryId":flight_id, "token":flight_token, "currency":"CAD","market":"US","locale":"en-US"}

        headers = {
            "x-rapidapi-key": "API KEY GOES HERE",
            "x-rapidapi-host": "skyscanner80.p.rapidapi.com"
            }
        response = requests.get(url, headers=headers, params=querystring)
        json_data = response.json()

        print(json_data)

        # Now grab the url

        result_url = json_data['data']['itinerary']['pricingOptions'][0]['agents'][0]['url']

        data = {'result_url': result_url}
        return data

    except:
        return "Something went wrong, we could not find the url for this flight"



@app.route('/api/search', methods=['POST'])
def search():
    data = request.json
    dep_loc = data['dep_loc']
    print(dep_loc)
    arr_loc = data['arr_loc']
    print(arr_loc)
    dep_date = data['dep_date']
    print(dep_date)
    seat_class = str(data['seat_class'])
    print(seat_class)
    currency = str(data['currency'])
    print(currency)
    print(data['round_trip'])
    if data['round_trip'] == True:
        return_date = data['return_date']
        print(return_date)
        results = search_results(dep_loc.title(), arr_loc.title(), dep_date, return_date, seat_class, currency.capitalize())
        print("Results being returned:", results)

    else:
        results = search_results_ow(dep_loc.title(), arr_loc.title(), dep_date, seat_class, currency.capitalize())

    return jsonify(results)


@app.route('/grabUrl', methods=['POST'])
def grab_url():
    """
    This function takes json data with a flights <id> and <token> and calls 
    on the function <search_url> to get the url that allows the user to buy 
    the flight ticket
    """
    data = request.json
    flight_token = data['token']
    flight_id = data['id']
    currency = data['currency']

    print(flight_token)
    print(flight_id)
    print(currency)
    # Now call the function
    result_url = search_url(flight_token, flight_id, currency)
    print(result_url)
    return jsonify(result_url)


# Database related functions


def create_connection():
    """
    Create a connection with the Supabase PostgreSQL database for the flight data project
    """
    try:
        connection = psycopg2.connect(
            host='HOST GOES HERE',
            user='USER GOES HERE',
            password='PASSWORD GOES HERE',
            dbname='DB NAME GOES HERE',
            port='PORT GOES HERE'
        )
        print("Successfully connected to the database")
        return connection
    except psycopg2.Error as e:
        print(f"Error while connecting to PostgreSQL: {e}")
        return None


def close_connection(connection):
    """
    Close the connection with the Supabase PostgreSQL database for the flight data project
    """
    if connection:
        connection.close()
        print("PostgreSQL connection is closed")


@app.route('/signup', methods=['POST'])
def signup():
    """
    This function receives the user data and then inserts it into the database by calling on
    the function <create_user>
    """
    connection = create_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'})
    
    user_data = request.json
    success = create_user(connection, user_data)
    close_connection(connection)

    if success:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False, 'message': 'Error inserting user'})


@app.route('/login', methods=['POST'])
def login():
    """
    This function receives user data and calls on email_lookup to get the result of the lookup.
    If the result is empty, recommend users to register or try a different email to login. If the
    result is not empty, then the credentials will be returned and can be validated in frontend.
    """
    connection = create_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'})
    
    user_data = request.json
    result = credentials_lookup(connection, user_data)
    close_connection(connection)

    if result:
        return jsonify({'success': True, 'result': result})
    
    else:
        return jsonify({'success': False, 'message': 'Error finding user.'})


@app.route('/send_verification_email', methods=['POST'])
def send_verification_email() -> None:
    """
    This function recieves the user data and sends an email to the user's email to verify that email.
    """
    user_data = request.json
    first_name = user_data['first_name']
    email = user_data['email']

    verification_code = email_verification(first_name, email) 
    # This stores the verification code while also sending the verification email

    return jsonify({"verification_code": verification_code})


@app.route('/add_to_recent_searches', methods=['POST'])
def add_to_recent_searches() -> None:
    """
    This function recieves data regarding the user and the search they 
    made and adds it to the recent_searches table on supabase by calling 
    the functions <id_lookup> and <add_recent_search>.
    """
    connection = create_connection()
    if not connection:
        return jsonify({'success': False, 'message': 'Database connection failed'})
    
    search_data = request.json
    user_id = id_lookup(connection, search_data['user_email'])
    # Grab the users id given the email

    success = add_recent_search(connection, user_id, search_data)

    close_connection(connection)

    if not success:
        print("Something went wrong when trying to add to the table")



if __name__ == '__main__':
    # app.run(port=5000, debug=True)
    app.run(host='0.0.0.0', port=8080, debug=True)




    