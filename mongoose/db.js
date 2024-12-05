const mongoose = require('mongoose');
const schema = mongoose.Schema;
const objectId = mongoose.Schema.Types.ObjectId;;
 

const User = new schema({
    name: String,
    email: {type: String, unique: true},
    password: String
  });

const Todo = new schema({
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