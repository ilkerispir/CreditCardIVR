const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);

app.get('/login', (req, res) =>{
    res.render('login');
});

const server = app.listen(process.env.PORT || 3000, () => {
    const host = server.address().address;
    const port = server.address().port;
});

