import pymysql
from flask import Flask, request, jsonify
from flask_cors import CORS
from signupIn import create_user, credentials_lookup, email_verification

app = Flask(__name__)
CORS(app)

def create_connection():
    """
    Create a connection with the MySQL database for the flight data project
    """
    try:
        connection = pymysql.connect(
            host='localhost',
            user='root',
            password='Chicago1103/5',
            database='FTC_database'
        )
        print("Successfully connected to the database")
        return connection
    except pymysql.MySQLError as e:
        print(f"Error while connecting to MySQL: {e}")
        return None

def close_connection(connection):
    if connection:
        connection.close()
        print("MySQL connection is closed")


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
    This function recieves user data and calls on email_lookup to get the result of the lookup.
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



if __name__ == '__main__':
    app.run(port=5001, debug=True)