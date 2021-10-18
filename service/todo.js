const pool = require('./../db/pool');

class Todolist {
    constructor( userId, listId="" ) {
        this.listId = parseInt(listId);
        this.userId = parseInt(userId);
    }

    create = (title, userId) => 
        pool.query(`INSERT INTO public.todo_list(owner_id, title) VALUES($1, $2) RETURNING *`, [parseInt(userId), title])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));

    isOwner = (userId, listId) => 
        pool.query(`SELECT * FROM public.todo_list WHERE owner_id = $1 AND id = $2`, [parseInt(userId), parseInt(listId)])
        .then(result => {
            console.log('Is Owner:', result.rows.length);
            if (result.rows.length !== 0)
                return true;
            return false;
        })
        .catch(err => console.log(err.stack));

    giveAccess = (userid, listid) => 
        pool.query(`INSERT INTO public.todolist_user_mapping(user_id, todo_list_id) VALUES($1, $2) RETURNING *`, [parseInt(userid), parseInt(listid)])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));

    delete = (listId) =>
        pool.query(`UPDATE public.todo_list SET is_deleted = true WHERE id = $1 RETURNING *`, [parseInt(listId)])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));

    isSharedTo = (userid, listId) => 
        pool.query(`SELECT * FROM public.todolist_user_mapping WHERE todo_list_id = $1 AND user_id = $2 AND is_deleted = false`, [parseInt(listId), parseInt(userid)])
        .then(result => {
            console.log('Is Shared To:', result.rows.length);
            if (result.rows.length !== 0)
                return true;
            return false;
        })
        .catch(err => console.log(err.stack));

    createTodo = (listid, authorid, todo) =>
        pool.query(`INSERT INTO public.todo(list_id, author_id, todo) VALUES($1, $2, $3) RETURNING *`, [parseInt(listid), parseInt(authorid), todo])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));

    getAllByUser = (userId) =>
        pool.query(`SELECT * FROM public.todo_list WHERE owner_id = $1 AND is_deleted = false UNION SELECT * FROM public.todo_list WHERE id IN (SELECT todo_list_id FROM public.todolist_user_mapping WHERE user_id = $1 AND is_deleted = false) AND is_deleted = false`, [parseInt(userId)])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));

    getListTodos = (listid) =>
        pool.query(`SELECT * FROM public.todo WHERE list_id IN (SELECT id FROM public.todo_list WHERE id = $1 AND is_deleted = false) AND is_deleted = false`, [parseInt(listid)])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));

    updateListTodo = (listid, todoid, todo) => 
        pool.query(`UPDATE public.todo SET todo = $3 WHERE list_id IN (SELECT id FROM public.todo_list WHERE id = $1 AND is_deleted = false) AND id = $2 AND is_deleted = false RETURNING *`, [parseInt(listid), parseInt(todoid), todo])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));
    
    deleteListTodo = (listid, todoid) => 
        pool.query(`UPDATE public.todo SET is_deleted = true WHERE list_id IN (SELECT id FROM public.todo_list WHERE id = $1 AND is_deleted = false) AND id = $2 RETURNING *`, [parseInt(listid), parseInt(todoid)])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));

    updateListTitle = (listid, title) =>
        pool.query(`UPDATE public.todo_list SET title = $2 WHERE id = $1 AND is_deleted = false RETURNING *`, [parseInt(listid), title])
        .then(result => {
            console.log(result.rows);
            return result.rows;
        })
        .catch(err => console.log(err.stack));
}

module.exports = Todolist;