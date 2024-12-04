const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;;
 

const User = new mongoose.Schema({
    email: String,
    password: String, 
    name: String,
})

const Todo = new mongoose.Schema({
    description: String,
    done: Boolean,
    userID: objectId,
})

const UserModel = mongoose.model('users', User);
const TodoModel = mongoose.model('todos', Todo);

module.exports= {
    UserModel,
    TodoModel
}