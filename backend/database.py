import sqlite3

conn = sqlite3.connect('users.db',check_same_thread=False)
c = conn.cursor()

def does_user_exit(email):
    sql = 'SELECT user_id FROM users WHERE email = ?'
    c.execute(sql,(email,))
    result = c.fetchone()
    if result: return True
    return False

def add_user_settings(email, settings):
    sql = "INSERT INTO users (email,food_restrictions) VALUES (?,?)"
    val = (email, settings)
    c.execute(sql,val)
    conn.commit()

def get_user_settings(email):
    sql = "SELECT food_restrictions FROM users WHERE email = ?"
    val = (email,)
    c.execute(sql,val)
    result = c.fetchone()
    if result: 
        print(result[0])
        return result[0]
    raise Exception("Email not found")

def edit_user_settings(email,settings):
    sql = "UPDATE users SET food_restrictions = ? WHERE email = ?"
    val = (settings,email)
    c.execute(sql,val)
    conn.commit()

def create_database():
    c.execute(''' 
        CREATE TABLE IF NOT EXISTS users (user_id INTEGER PRIMARY KEY,
        email VARCHAR(110) NOT NULL,
        food_restrictions VARCHAR(110) NOT NULL) 
    ''')