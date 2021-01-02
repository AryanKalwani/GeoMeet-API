const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();
const pool = require("./db");
const cors = require("cors");

app.use(express.json());
app.use(cors());

app.all('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

app.post("/user/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        var newUser = await pool.query("INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING *", [username, email, hash, 'YES']);
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

app.post("/user/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        var queryResult = await pool.query(`SELECT password FROM users WHERE email= '${email}'`);
        if (queryResult.rows.length==0) {
            res.status(202).json({
                "msg": "Email has not been registered"
            });
        } else {
            const passHash = queryResult.rows[0].password;
            var result = bcrypt.compareSync(password, passHash);
            if (result) {
                res.status(200).json({
                    "msg": "Login Successful"
                });
            }
            else {
                res.status(202).json({
                    "msg": "Incorrect Password"
                });
            }
        }
    } catch(err) {
        res.status(400).json(err.message);
    }
})

app.post("/user/changestatus", async (req, res) => {
    try {
        const { username, varStatus } = req.body;
        var queryResult = await pool.query(`UPDATE users SET online='${varStatus}' WHERE username='${username}' RETURNING *`);
        res.status(201).json(queryResult.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

app.post("/user/location", async(req, res) => {
    try {
        const { username, location } = req.body;
        var queryResult = await pool.query(`UPDATE users SET location='${location}' WHERE username='${username}' RETURNING *`);
        res.status(201).json(queryResult.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

app.post("/user/sendreq", async(req, res) => {
    try {
        const { username, friend } = req.body;
        var queryResult = await pool.query(`UPDATE users SET reqsent=array_append(reqsent, '${friend}') WHERE username='${username}' RETURNING *`);
        var utilResult = await pool.query(`UPDATE users SET reqreceived=array_append(reqreceived, '${username}') WHERE username='${friend}' RETURNING *`);
        res.status(201).json(queryResult.rows[0]);
    } catch (err) {
        res.status(400).json(err.message);
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running");
});
