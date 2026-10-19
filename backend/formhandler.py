import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

#pip install psycopg2-binary and pip install python.dotenv
#Have an file named .env in the same folder with a line DATABASE_URL = url from Mikael

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def add_form(id, name, adress):
    conn = None
    cursor = None

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            INSERT INTO Pins (id, name, adress)
            VALUES (%s, %s, %S)
        """, (id, name, adress)
        )

        inserted_id = cursor.fetchone()[0]

        conn.commit()

        print(f'Inserted pin with ID: {inserted_id}')

    except Exception as e:
        print("Error:", e)

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()

def get_forms():
    conn = None
    cursor = None 

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            SELECT *
            FROM forms
        """)

        forms = cursor.fetchall()

        if forms:
            print("Forms found")
            return forms

        else:
            print("No forms found")
            return None


    except Exception as e:
        print("Error:", e)

    finally:
        if cursor:
            cursor.close()

        if conn:
            conn.close()

print(get_forms())