import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "tumonline",
  password: "Br49mb46.M",
});

export default pool.promise();
