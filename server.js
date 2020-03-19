const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.use(cookieParser());


app.get('/login', (req, res) =>{ 
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=login&email="+ req.cookies.aloTechMail +"&app_token="+ req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.login){
            res.redirect('payment');
        }else{
            res.render('login');
        }
    });
});

app.post('/login', (req, res) => {
    let inputEmail = req.body.inputEmail;
    let inputPassword = req.body.inputPassword;

    let url = "https://smartkontak.musterihizmetleri.com/api/?function=login&email="+ inputEmail +"&password="+ inputPassword;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.login){
            console.log(json.email);
            res.cookie('aloTechMail', req.body.inputEmail);
            res.cookie('aloTechSession', "ahRzfm11c3RlcmktaGl6bWV0bGVyaXIfCxISVGVuYW50QXBwbGljYXRpb25zGICA6PSC7r4KDKIBIXNtYXJ0a29udGFrLm11c3RlcmloaXptZXRsZXJpLmNvbQ");
            res.redirect('payment');
        }else{
            res.render('login');
        }
    });
});

app.get('/payment', (req, res) => {
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=login&email="+ req.cookies.aloTechMail +"&app_token="+ req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.login){
            res.render('payment');
        }else{
            res.redirect('login');
        }
    });
});

const server = app.listen(process.env.PORT || 3000, () => {
    const host = server.address().address;
    const port = server.address().port;
});
