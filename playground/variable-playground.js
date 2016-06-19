// var person = {
// 	name: 'Andrew',
// 	age: 21
// };

// function updatePerson (obj) {
// 	// obj = {
// 	// 	name: 'Andrew',
// 	// 	age: 24
// 	// };

// 	obj.age = 24;
// }

// updatePerson(person);
// console.log(person);


//Array Example

var grades = [15, 37];

function addGrades (gradesArr) {


	gradesArr.push(55);
	debugger;
	//Grades passed by reference, so the array value 2 is updated from 37 to 25
	gradesArr[1] = 25;

}

console.log(grades);
addGrades(grades);
console.log(grades);
