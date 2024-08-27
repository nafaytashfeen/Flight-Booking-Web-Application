import psycopg2
from psycopg2 import sql

def id_lookup(connection, email: str) -> int:
    """
    Return the user's id given the email
    """
    try:
        with connection.cursor() as cursor:
            credentials_lookup_query = sql.SQL("""
            SELECT ID FROM USERS
            WHERE email = %s;
            """)
            cursor.execute(credentials_lookup_query, (email,))
            result = cursor.fetchone()

            if result:
                return result[0]
            
            else:
                return None
                # Something went wrong, the user wasnt found, this shouldnt happen


    except psycopg2.Error as e:
        print(f"Error while searching for user: {e}")
        return None


def add_recent_search(connection, id, search_data) -> bool:
    """
    This function adds to the recent_searches table given the search data and user id.
    A bool is returned determining success
    """
    try:
        with connection.cursor() as cursor:
            create_user_query = sql.SQL("""
            INSERT INTO recent_searches (user_id, dep_loc, arr_loc, dep_date, return_date, search_time)
            VALUES (%s, %s, %s, %s, %s, NOW());
            """)
            cursor.execute(create_user_query, (
                id,
                search_data['dep_loc'],
                search_data['arr_loc'],
                search_data['dep_date'],
                search_data['return_date']
            ))
            connection.commit()

    except psycopg2.Error as e:
        print(f"Error while inserting user: {e}")
        return False
    
    return True