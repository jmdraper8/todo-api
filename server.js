var express = require('express');
var bodyParser = require('body-parser');
var app = express();

//provided by heroku process.env.PORT
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());


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

//POST /todos/
app.post('/todos', function (req, res) {
	// var body = req.body;
	// var todo = {
	// 	id: 0,
	// 	description: '',
	// 	completed: false
	// }

	// console.log(todos.length);
	// todo.id = todos.length + 1;
	// todo.description = body.description;
	// todos.push(todo);
	// console.log(todos);
	// console.log('Decription: ' + body.description);

	var body = req.body;

	body.id = todoNextId++;

	todos.push(body);

	res.json(todos);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
