const express = require('express');
const exphbs = require('express-handlebars');

const app = express();

// Load Routes Files
const index = require('./routes/index');

// Express Handlebars Middleware
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Use Routes
app.use('/', index);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log('Server started on port ' + port);
});
