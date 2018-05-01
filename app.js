const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Load Routes Files
const index = require('./routes/index');
const users = require('./routes/users');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use Routes
app.use('/', index);
app.use('/users', users);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server started on port ' + port);
});
