var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');

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
	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	// var matchedTodo;
	// todos.forEach(function (todo) {
	// 	if (todoId === todo.id) {
	// 		matchedTodo = todo;
	// 	}
	// });

	if (matchedTodo) {
		res.json(matchedTodo);
	} else {
		res.status(404).send();
	}

});

//POST /todos/
app.post('/todos', function (req, res) {

	var body = _.pick(req.body, 'description', 'completed');

	if (!_.isBoolean(body.completed) || !_.isString(body.description) || body.description.trim().length === 0) {

		//Status 400 request can't be completed because bad data was provided
		return res.status(400).send();

	}

	body.description = body.description.trim();

	//add id Field
	body.id = todoNextId++;

	//push onto array
	todos.push(body);
	res.json(todos);

});


app.delete('/todos/:id', function (req, res) {

	var todoId = parseInt(req.params.id, 10);
	var matchedTodo = _.findWhere(todos, {id: todoId});

	if (! matchedTodo) {
		res.status(404).json({"Error": "No todo found with id: " + todoId});
	} else {
		todos = _.without(todos, matchedTodo)
		res.json(matchedTodo);
	}

});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});
