var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');
var db = require('./db.js');
var bcrypt = require('bcrypt');
var middleware = require('./middleware.js')(db);

//provided by heroku process.env.PORT
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json());


app.get('/', function(req, res) {
	res.send('Todo API Root');
});

//GET Request /todos
app.get('/todos', middleware.requireAuthentication, function(req, res) {

	var query = req.query;
	var where = {
		userId: req.user.get('id')
	};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.trim().length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({where: where}).then(function (todos) {
		res.json(todos);
	}, function (e) {
		res.status(500).send();
	})

});


//GET Request /todos/:id 
app.get('/todos/:id', middleware.requireAuthentication, function(req, res) {
	var todoId = parseInt(req.params.id, 10);

	db.todo.findOne({ where: {
		id: todoId,
		userId: req.user.get('id')
	}}).then(function (todo) {
		if (!!todo) {
			res.json(todo.toJSON());			
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(400).json(e);
	});
});

//POST /todos/
app.post('/todos', middleware.requireAuthentication, function (req, res) {

	var body = _.pick(req.body, 'description', 'completed');

	db.todo.create(body).then(function (todo) {
		// res.json(todo.toJSON());
		req.user.addTodo(todo).then(function () {
			return todo.reload();
		}).then(function (todo) {
			res.json(todo.toJSON());
		});
	}, function (e) {
		res.status(400).json(e);
	});

});


app.delete('/todos/:id', middleware.requireAuthentication, function(req, res) {

	var todoId = parseInt(req.params.id, 10);

	db.todo.destroy({
		where: {
			id: todoId,
			userId: req.user.get('id')
		}
	}).then(function (rowsdeleted) {
		if (rowsdeleted === 0) {
			res.status(404).json({
				error: 'No todo with id: ' + todoId
			});
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	});
});

//Update - using Http PUT 
app.put('/todos/:id', middleware.requireAuthentication, function (req, res) {

	var todoId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'description', 'completed');
	var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	db.todo.findOne({ where: {
		id: todoId,
		userId: req.user.get('id')
	}}).then(function(todo) {
		if (todo) {
			return todo.update(attributes).then(function(todo) {
				res.json(todo.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	});

});

//POST /users/
app.post('/users', function (req, res) {

	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (users) {
		res.json(users.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});

});

//POST /users/login
app.post('/users/login', function (req, res) {

	var body = _.pick(req.body, 'email', 'password');
	var userInstance;

	db.user.authenticate(body).then(function (user) {
		var token = user.generateToken('authentication');
		//console.log(token);
		userInstance = user;

		return db.token.create({
			token: token
		});

	}).then(function (tokenInstance) {
		res.header('Auth', tokenInstance.get('token')).json(userInstance.toPublicJSON());
	}).catch(function () {
		res.status(401).send();
	});

});

//DELETE /users/login
app.delete('/users/login', middleware.requireAuthentication, function (req, res) {

	req.token.destroy().then(function () {
		res.status(204).send();
	}).catch(function () {
		res.status(500).send();
	});

});

db.sequelize.sync({force: true}).then(function () {
	app.listen(PORT, function () {
		console.log('Express listening on port ' + PORT + '!');
	});
});

