var express = require('express');
var app = express();

//provided by heroku process.env.PORT
var PORT = process.env.PORT || 3000;


app.get('/', function (req, res) {
	res.send('Todo API Root');
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
