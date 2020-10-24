const express = require('express');
const app = express();
//importing json web token
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

const bodyParser = require('body-parser');
const path = require('path');



app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-control-Allow-Headers', 'content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


const PORT = 3000;



const secretKey = 'My super secret key';
//defining mw
const jwtMW = exjwt({
    secret: secretKey,
    algorithms: ['HS256']
})

//defining middleware for setttings route pending
 

let users = [
    {
        id: 1,
        username: 'Kritika',
        password: '123'
    },
    {
        id: 2,
        username: 'Dutt',
        password: '456'
    }
];


app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
        
    for(let user of users){
        if(username == user.username && password == user.password){
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3minutes'});
            res.json({
                success:true,
                err: null,
                token
            });
          
            break;
       }
       else{
           res.status(401).json({
               success: false,
               token: null,
               err: 'Username or password is incorrect'
           });
       }
    }
    });




   
//creating a settings route
app.get('/api/settings', jwtMW, (req, res) => {
     res.json({
        success: true,
        myContent: 'This is a settings secret route!!!'
    });

});

//creating secure route
app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged in people can see!!!'
    });

});

 app.get('/', (req, res) => {
     res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function (err, req, res, next){
    console.log(err.name == 'UnauthorizedError');

    if (err.name === 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError: err, 
            err: 'Username or password is incorrect 2'
        });
    }
    else {
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);

});