const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

//use to hash our passwords
const bcrypt = require("bcrypt")
//property we are going to be using in our passwords
const saltRounds = 10

const app = express();
//use to parse objects sent from the front end
app.use(express.json());
//allow cross platfrom resource sharing
app.use(cors());


const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Scooby99",
    database: "sys_log_in_info",
});

const blogDB = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "Scooby99",
    database: "blog",
})


app.get("/",(req, res) => {
    res.send("hi")
})











//post request to register user
app.post("/signup", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    //has our password
    bcrypt.hash(password,saltRounds, (err,hash) => {
        if(err) {
            console.log(err)
        }
        db.query (
            "INSERT INTO userinfo (username,password) VALUES (?,?)",
            [username,password],
            (err,result) => {
                console.log(err)
                console.log(result)
            }
        )
    }
    );
});

//post request for user to login

app.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM userinfo WHERE username = ? AND password = ?",
        [username, password],
        (err,result) => {
            if(err) {
                res.send({err: err});
            }

            if(result.length > 0) {
                // bcrypt.compare(password, result[0].password, (err,response) => {
                //     if(response) {
                //         res.send(result)
                //     } else {
                //         res.send({message: "Wrong username or password"})
                //     }
                // })
                res.send(result)
            } else {
                res.send({message: "User does not exist :("})
            }
        }    
    );
});





app.post("/post", (req, res) => {

    const username = req.body.username;
    const title = req.body.title;
    const body = req.body.body;



    const query = "INSERT INTO posts (title, post_text, username) VALUES (?,?,?)"
    blogDB.query(query, [title, body, username], (err, result) =>{
        if(err) throw err;
        console.log(result)
    });
    res.send("post sent")
});


app.get("/get-posts", (req,res) => {
    query = "SELECT * FROM posts"
    blogDB.query(query, (err, result) => {
        if(err) {
            console.log(err)
        }


        res.send(result)
    })
})


app.get("/getPostFromId/:id", (req,res) => {
    const id = req.params.id;
    query = "SELECT * FROM posts where id = ?";
    blogDB.query(query, id, (err, result) => {
        if(err) throw err;
        res.send(result)
    })
})



app.listen(3005, () => {
    console.log("running server");
});