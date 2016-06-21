var Sequelize = require('sequelize');

var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
});

var User = sequelize.define('user', {
	email: Sequelize.STRING
})

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	// force: true
	}).then(function () {

	console.log('Everything is synced');

	Todo.findAll({where: {
		completed: true
	}}).then(function (todos) {
		if (todos.length > 1) {
			todos.forEach(function (todo) {
				console.log(todo.toJSON());
			});
		} else if (todos.length === 0) {
			console.log('No todos found');
		}
			
	});

	// User.create({
	// 	email: 'johndraper@icloud.com'
	// }).then(function () {
	// 	return Todo.create({
	// 		description: 'clean yard'
	// 	});
	// }).then(function (todo) {
	// 	return User.findById(1).then(function (user) {
	// 		user.addTodo(todo);
	// 	});
	// });
});