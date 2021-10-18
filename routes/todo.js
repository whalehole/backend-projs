const express = require('express');
const router = express.Router();
const TokenService = require('./../service/token');
const TodoService = require('./../service/todo');
const UserService = require('../service/user');
const Rabbit = require('./../service/amqplib');

const tokenService = new TokenService();
const userService = new UserService();
const todoService = new TodoService();
const rabbit = new Rabbit();

// CREATE TODO LIST
router.post('/', async (req, res)=>{
    if (!req.body.title)
        return res.status(400).send({status: 'Pls provide a title'});

    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const todolist = await todoService.create(req.body.title, await userService.getId(user['email']));
    if (!todolist) 
        return res.status(500).send({status: 'Failed to create list'});

    return res.status(201).send({status: 'Todo list has been created', todolist: todolist});
})

// GET ALL TODOLISTS THAT IS ACCESSIBLE TO THE AUTHENTICATED USER
router.get('/', async (req, res)=>{
    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    const todolist = await todoService.getAllByUser(userId);
    if (todolist.length === 0) 
        return res.status(200).send({status: 'User has no todo lists'});

    return res.status(200).send({status: 'User has todo lists', todolist: todolist});
})

// GET ALL TODOS OF A TODOLIST, FORBIDDEN IF RESTRICTED ACCESS
router.get('/:id/todos', async (req, res)=>{
    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    if (!(await todoService.isOwner(userId, req.params.id)) && !(await todoService.isSharedTo(userId, req.params.id)))
        return res.status(403).send({status: 'User is forbidden'});

    const todos = await todoService.getListTodos(req.params.id);
    if (todos.length === 0) 
        res.status(200).send({status: 'Todo list has no todos, or list has been deleted'});

    return res.status(200).send({status: 'Todo list has todos', todos: todos});
})

// UPDATE TODOLIST TITLE, FORBIDDEN IF RESTRICTED ACCESS
router.put('/:id', async (req, res)=>{
    if (!req.body.title)
        return res.status(400).send({status: "Pls provide a title"});

    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    if (!(await todoService.isOwner(userId, req.params.id)) && !(await todoService.isSharedTo(userId, req.params.id)))
        return res.status(403).send({status: 'User is forbidden'});
 
    const todolist = await todoService.updateListTitle(req.params.id, req.body.title);
    if (todolist.length === 0)
        return res.status(404).send({status: "No todo list to update title"});

    return res.status(200).send({status: "Todo list title is updated", todolist: todolist});
})

// DELETE A TODOLIST
router.delete('/:id', async (req, res)=>{
    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    if (!(await todoService.isOwner(userId, req.params.id)))
        return res.status(403).send({status: 'User is forbidden'});

    await todoService.delete();
    return res.status(200).send("Todo list has been deleted");
})

// CREATE TODOS OF A TODOLIST
router.post('/:id', async (req, res)=>{
    if (!req.body.todo) 
        return res.status(400).send({status: 'Pls provide a todo'});

    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    if (!(await todoService.isOwner(userId, req.params.id)) && !(await todoService.isSharedTo(userId, req.params.id)))
        return res.status(403).send({status: 'User is forbidden'});

    const todo = await todoService.createTodo(req.params.id, userId, req.body.todo);
    return res.status(200).send({status: "Todo is created", todo: todo});
})

// UPDATE A TODO OF A TODOLIST
router.put('/:listid/todos/:todoid', async (req, res)=>{
    if (!req.body.todo) 
        return res.status(400).send({status: 'Pls provide a todo'});

    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    if (!(await todoService.isOwner(userId, req.params.listid)) && !(await todoService.isSharedTo(userId, req.params.listid)))
        return res.status(403).send({status: 'User is forbidden'});

    const todo = await todoService.updateListTodo(req.params.listid, req.params.todoid, req.body.todo);
    if (todo.length === 0)
        return res.status(404).send({status: "No todo list or todo to update dodo"});

    return res.status(200).send({status: "Todo is updated", todo: todo});
})

// DELETE A TODO OF A TODOLIST
router.delete('/:listid/todos/:todoid', async (req, res)=>{
    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    if (!(await todoService.isOwner(userId, req.params.listid)) && !(await todoService.isSharedTo(userId, req.params.listid)))
        return res.status(403).send({status: 'User is forbidden'});

    const todo = await todoService.deleteListTodo(req.params.listid, req.params.todoid);
    if (todo.length === 0)
        return res.status(404).send({status: "Cannot delete a todo without a todolist"})
    
    return res.status(200).send({status: "Todo is deleted", todo: todo});
})

// GIVE ACCESS TO ANOTHER USER TO A TODOLIST
router.post('/:listid/adduser/:userid', async (req, res)=>{
    const user = tokenService.verifyToken(req.headers.authorization);
    if (!user)
        return res.status(401).send({status: 'User is unauthorized'});

    const userId = await userService.getId(user['email']);

    if (!(await todoService.isOwner(userId, req.params.listid)))
        return res.status(403).send({status: 'User is forbidden'});

    console.log(await rabbit.publish('todolist_user', {listId: req.params.listid, userId: req.params.userid}));
    return res.status(200).send({status: 'User is given access to the todolist'});

})

module.exports = router;