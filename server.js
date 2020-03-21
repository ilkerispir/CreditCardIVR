const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const JSAlert = require("js-alert");


const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.use(cookieParser());


app.get('/login', (req, res) =>{ 
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=ping&session=" + req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.success){
            res.redirect('payment');
        }else{
            var message = "";
            res.render('login', {message: message});
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
            res.cookie('aloTechMail', req.body.inputEmail);
            res.cookie('aloTechSession', json.session);
            res.redirect('payment');
        }else{
            var message = "Kullancı adı veya Şifre Hatalı";
            res.render('login', {message:message});
        }
    });
});

app.get('/payment', (req, res) => {   
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=ping&session=" + req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.success){           
            res.render('payment', {customvariables:'', check:''});   
        }else{
            res.redirect('login');
        }
    });
});

app.get('/transfer', (req, res) => {    
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=getmyactivecalls&session=" + req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.success){            
            let url2 = "https://smartkontak.musterihizmetleri.com/api/?function=softphoneTransfer2Ivr"+
                        "&session="+ req.cookies.aloTechSession +
                        "&attendantkey="+ "ahRzfm11c3RlcmktaGl6bWV0bGVyaXIWCxIJQXR0ZW5kYW50GICAuJLtktQKDKIBIXNtYXJ0a29udGFrLm11c3RlcmloaXptZXRsZXJpLmNvbQ" +
                        "&callid="+ json.MyActiveCalls[0].key +
                        "&transactionid="+ "ilkerivr";
 
            res.redirect(url2);
        }else{
            res.status(500).json({message: "Server Error."});
        }
    });
});

app.get('/getCard', (req, res) => {
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=getmyactivecalls&session=" + req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.success){           
            let url2 = "https://smartkontak.musterihizmetleri.com/api/?function=getactivecall"+
                        "&session="+ req.cookies.aloTechSession +
                        "&activecallkey="+ json.MyActiveCalls[0].key;

            console.log(url2);
            let settings2 = { method: "Get" };

            fetch(url2, settings2)
            .then(res2 => res2.json())
            .then((json2) => {                
                res.render('payment', {customvariables: json2.customvariables, check:''});
            });
        }else{
            res.status(500).json({message: "error"});
        }
    });
});

app.get('/bill', (req, res) => {
    let number = req.param('number');
    let expiration = req.param('expiration');
    let securitycode = req.param('securitycode');
    
    if(number && expiration && securitycode){
        console.log('{"success":"true"}');
        res.render('payment', {customvariables: '', check: 'true'});
    }else{
        console.log('{"success":"false"}');   
        res.render('payment', {customvariables: '', check: 'false'});
    }  
});



const server = app.listen(process.env.PORT || 3000, () => {
    const host = server.address().address;
    const port = server.address().port;
});

