var express = require('express');
var app = express();

//provided by heroku process.env.PORT
var PORT = process.env.PORT || 3000;
var todos = [];

var todoNextId = 1;


app.get('/', function (req, res) {
	res.send('Todo API Root');
});

//GET Request /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});


//GET Request /todos/:id
app.get('/todos/:id', function (req, res) {
	var todoId = parseInt(req.params.id);
	var matchedTodo;

	todos.forEach(function (todo) {
		if (todoId === todo.id) {
			matchedTodo = todo;
		}
	});

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
		res.send('404 Error ' + todoId + ' not found!');
	}

	res.send('Asking for todo with id of ' + req.params.id);


});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
