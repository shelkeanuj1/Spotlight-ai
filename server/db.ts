import mysql from "mysql2/promise";

export const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Hihetal21@", // 👈 put your MySQL password here
  database: "spotlight_ai",
});
