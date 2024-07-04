const express = require("express");
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const { faker } = require('@faker-js/faker');
const { v4: uuidv4 } = require('uuid');
const mysql = require('mysql2');
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(methodOverride('_method'));
app.use(express.urlencoded({extended:true}));
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'rev',
    password:"aayush_roy03",
});


app.listen("8080",()=>{
    console.log(`app listening on port 8080`);
})
app.get("/home",(req,res)=>{
    try{
        let q = `SELECT count(id) As userCount FROM student`;
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let count = result[0].userCount;
        res.render("index",{count});
    })
    }catch(err)
    {
        console.log(err);
    }
    
})
app.get("/home/show",(req,res)=>{
    let q = `SELECT * FROM student`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let user = result;
            res.render("show",{user})
        })
    }catch(err)
    {
        console.log(err);
        res.send("something went wrong in DB");
    }
    
})
app.get('/home/show/new',(req,res)=>{
    res.render("new")
});
app.post('/home',(req,res)=>{
    let id = uuidv4();
    let {username,email,password} = req.body;
    let q = `INSERT INTO student (id,username,email,password) VALUES (?,?,?,?)`;
    try{
        connection.query(q,[id,username,email,password],(err,result)=>{
            if(err) throw err;
            console.log(result);
            res.redirect("/home/show")
        })
    }catch(err)
    {
        console.log(err);
        res.send('something wrong in DB');
    }
})
app.get('/home/:id/check',(req,res)=>{
    let {id} = req.params;
    let q = `SELECT id,username,email FROM student WHERE id = '${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let data = result;
            let user = data.find((p)=>id===p.id);
            res.render("check",{user});
        })
    }catch(err)
    {
        console.log(err);
    }
    
});
app.get('/home/:id/edit',(req,res)=>{
    let {id} = req.params;
    let q = `SELECT * FROM student WHERE id = '${id}'`;
    try{
        connection.query(q,(err,result)=>{
            if(err) throw err;
            let data = result[0];
            res.render("edit",{data})
            console.log(data)
        })
    }catch(err)
    {
        console.log(err);
    }
    
});
app.patch('/home/:id',(req,res)=>{
    let {id} = req.params;
    let {username:newUser,password:newPass} = req.body;
    let q = `SELECT * FROM student WHERE id = '${id}'`;
    connection.query(q,(err,result)=>{
        if(err) throw err;
        let user = result[0];
        console.log(`username: ${newUser}`)
        console.log(`password : ${newPass}`);
        if(newPass!=user.password)
        {
            res.send("Wrong Password");
        }
        else{
            let q2 = `UPDATE student SET username = '${newUser}' WHERE id = '${id}'`;
            connection.query(q2,(err,result)=>{
                res.redirect("/home/show");
            })
        }
    })
})
app.delete('/home/:id',(req,res)=>{
    let {id} = req.params;
    let q = `DELETE FROM student WHERE id = '${id}'`;
    connection.query(q,(err,result)=>{
        if(err) throw err;
        res.redirect("/home/show")
    })
})
