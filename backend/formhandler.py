import psycopg2
from psycopg2.extras import RealDictCursor
import os
from dotenv import load_dotenv

#pip install psycopg2-binary and pip install python.dotenv
#Have an file named .env in the same folder with a line DATABASE_URL = url from Mikael

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def add_form(name, adress, station, itemid, itemname, itemtype):
    conn = None
    cursor = None

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            CREATE TABLE IF NOT EXISTS forms (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            adress TEXT,
            station TEXT,
            itemid TEXT NOT NULL,
            itemname TEXT NOT NULL,
            itemtype TEXT NOT NULL,
            );
        """)

        cursor.execute("""
            INSERT INTO forms (name, adress, station, itemid, itemname, itemtype)
            VALUES (%s, %s, %S, %s, %s, %s, )
        """, (name, adress, station, itemid, itemname, itemtype)
        )

        inserted_id = cursor.fetchone()[0]

        conn.commit()

        print(f'Inserted form with ID: {inserted_id}')

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


def delete_forms_table():
    conn = None
    cursor = None

    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        cursor.execute("""
            DROP TABLE IF EXISTS forms
                       """)

        conn.commit()
        

    except Exception as e:
        print("Error", e)

    finally:

        if cursor:
            cursor.close()

        if conn:
            conn.close()


print(get_forms())