import mysql from "mysql2"
import dotenv from 'dotenv'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
dotenv.config()
const secret = 'secretkey';


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
}).promise()

export async function getpost(){
    const [rows] = await pool.query("SELECT * FROM company")
    return rows
}

export async function getposts(id){
        const [rows] = await pool.query(`SELECT * FROM company WHERE CompanyId = ?`, [id])
        return rows[0]
    }

export async function getpos(id){
        const [rows] = await pool.query(`SELECT * FROM companyadmin WHERE CompanyAdminId = ?`, [id])
        return rows[0]
    }

export async function register(CompanyName, CompanyEmail, CompanyAddress, CompanyPhone) {
   try {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(CompanyEmail)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    const [res] = await pool.query(`
    INSERT INTO company (CompanyName, CompanyEmail, CompanyAddress, CompanyPhone)
    VALUES (?, ?, ?, ?)
    `, [CompanyName, CompanyEmail, CompanyAddress, CompanyPhone])
    const id = res.insertId

  return getposts(id);
   } catch (error) {
    return { error: 'An error occurred' };
   }
 }

export async function companyadmin(FirstName, SurName, Email, PhoneNumber, password) {

    try {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        if (!emailRegex.test(Email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
        
        const [existingUser] = await pool.query(`SELECT * FROM companyadmin WHERE Email = ?`, [Email]);
        if (existingUser[0]) {
            return { error: 'Email already exists' };
        }

        const [res] = await pool.query(`
        INSERT INTO companyadmin (FirstName, SurName, Email, PhoneNumber, password)
        VALUES (?, ?, ?, ?, ?)
        `, [FirstName, SurName, Email, PhoneNumber, password])
        const user = res.insertId
       return getpos(user)
       
    } catch (error) {
          return { error: 'An error occurred' };
    }

 }

export async function login(email, password) {
    try {
        const [rows] = await pool.query(`SELECT * FROM companyadmin WHERE Email = ?`, [email]);
        if (!rows[0]) {
            return { error: 'Email is not register' };
        }
        const match = await bcrypt.compare(password, rows[0].password);
        if (match) {
            const { CompanyAdminId, Email } = rows[0];
            // create and return JWT
            return { token: jwt.sign({ CompanyAdminId, Email }, secret) };
        } else {
            return { error: 'Incorrect password' };
        }
    } catch (err) {
        console.log(err);
        return { error: 'An error occurred' };
    }
}


async function performTransaction() {
    const connection = await pool.getConnection();
    connection.beginTransaction(async (err) => {
      if (err) {
        throw err;
      }
      try {
        await register()
        await companyadmin()
        await login();
        connection.commit((err) => {
          if (err) {
            return connection.rollback(() => {
              throw err;
            });
          }
          console.log('Transaction completed');
        });
      } catch (err) {
        connection.rollback(() => {
          throw err;
        });
      }
    });
    connection.release();
  }
  
  performTransaction();




































// export async function getpost(){
//     const [rows] = await pool.query("SELECT * FROM postss")
//     return rows
// }

// export async function getposts(id){
//     const [rows] = await pool.query(`SELECT * FROM postss WHERE id = ?`, [id])
//     return rows[0]
// }

// export async function createpost(title, body) {
//    const [res] = await pool.query(`
//     INSERT INTO postss (title, body)
//     VALUES (?, ?)
//     `, [title, body])
//     const id = res.insertId
//     return getposts(id)
// }

// export async function signUp(username, password) {
//     let hash = await bcrypt.hash(password, 10)

//     const [res] = await pool.query(`
//     INSERT INTO users (username, password)
//     VALUES (?, ?)
//     `, [username, hash])
   
//     return {
//         username,
//         password
//     }

// }
