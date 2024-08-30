import pymysql
import psycopg2
from psycopg2 import sql
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import random


def create_user(connection, user_data) -> bool:
    """
    Create a user by adding credentials and other info to the USERS table in the Supabase PostgreSQL database.
    Returns a bool indicating success.
    """
    try:
        with connection.cursor() as cursor:
            create_user_query = sql.SQL("""
            INSERT INTO USERS (first_name, last_name, email, password)
            VALUES (%s, %s, %s, %s);
            """)
            cursor.execute(create_user_query, (
                user_data['first_name'],
                user_data['last_name'],
                user_data['email'],
                user_data['password']
            ))
            connection.commit()

    except psycopg2.Error as e:
        print(f"Error while inserting user: {e}")
        return False
    
    return True

def credentials_lookup(connection, user_data) -> bool:
    """
    Lookup given credentials in <user_data> and return a bool determining success.
    """
    try:
        with connection.cursor() as cursor:
            credentials_lookup_query = sql.SQL("""
            SELECT * FROM USERS
            WHERE email = %s AND password = %s;
            """)
            cursor.execute(credentials_lookup_query, (user_data['email'], user_data['password']))
            result = cursor.fetchone()

            if result:
                return True
            else:
                return False

    except psycopg2.Error as e:
        print(f"Error while searching for user: {e}")
        return False


def generate_verification_code() -> str:
    """
    Create a 6 digit verification code randomly generated
    """
    verification_code = ""
    for i in range(6):
        verification_code += str(random.randint(0, 9))

    return verification_code


def email_verification(first_name, receiver_email) -> str:
    """
    Verify the email of registering user by sending a verification code, 
    given the receiver's email.
    """
    # Create a verification code
    verification_code = generate_verification_code()

    sender_email = "SENDER_EMAIL_HERE"
    sender_password = "EMAIL_PASSWORD_HERE" # App key

    subject = f"Flighter Account Verification Code"
    body = f"Dear {first_name}, Your Flighter verification code is {verification_code}. This code will only be valid for 3 minutes"

    # Set up the MIME
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    # Connect to the server
    server = smtplib.SMTP("smtp.gmail.com", 587)
    server.starttls()
    server.login(sender_email, sender_password)

    # Send the email
    text = message.as_string()
    server.sendmail(sender_email, receiver_email, text)
    server.quit()

    return verification_code
    # return the code so that it can be checked to make sure the input code 
    # that user will put, matches


if __name__ == '__main__':
    # email_verification("Nafay", "nafaytashfeen@gmail.com")
    pass