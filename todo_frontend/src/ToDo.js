import { useState, useEffect } from "react";

export default function ToDo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("")
    const [editId, setEditId] = useState(-1);

    const apiUrl = "http://localhost:8000";
 
    const handleSubmit = (e) => {
        setError("");
        //check inputs
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    description
                })
            }).then((res) => {
                //add item to the list
                if (res.ok) {
                    setTodos([...todos, {title, description}]);
                    setTitle("");
                    setDescription("");
                    setMessage("Item added successfully!");
                    setTimeout(() => {
                        setMessage("");                        
                    }, 2000);
                } else {
                    //set error message
                    setError("Unable to create todo item.");
                }
            }).catch(() => { 
                setError("Unable to create todo item.");
            })
        }
    }

    useEffect(() => {
        getToDoItems();
    }, []);

    const getToDoItems = () => {
        fetch(apiUrl + "/todos")
       .then((res) => res.json())
       .then((data) => {
            setTodos(data);
        })
    }

    const handleUpdate = () => {
        setError("");
        //check inputs
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription
                })
            }).then((res) => {
                //update item to the list
                if (res.ok) {
                    const updatedTodos = todos.map((item) =>{
                        if (item._id == editId) {
                            item.title = editTitle;
                            item.description = editDescription;
                        }
                        return item;
                    });
                    setTodos(updatedTodos);
                    setEditTitle("");
                    setDescription("");
                    setMessage("Item updated successfully!");
                    setTimeout(() => {
                        setMessage("");
                    }, 2000);
                    setEditId(-1);
                } else {
                    //set error message
                    setError("Unable to update todo item.");
                }
            }).catch(() => { 
                setError("Unable to update todo item.");
            })
        }
    }

    const handleEdit = (todo) => {
        setEditId(todo._id); 
        setEditTitle(todo.title); 
        setEditDescription(todo.description);
    }

    const handleEditCancel = () => {
        setEditId(-1);
    }

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete?')) {
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE"
            })
            .then(() => { 
                const updatedTodos = todos.filter((todo) => todo._id !== id);
                setTodos(updatedTodos);
            })
        }
    }

    return  <>
        <div className="row p-3 bg-success text-light">
            <h1>ToDo Project with MERN Stack!</h1>
        </div>
        <div className="row">
            <h3>Add Item</h3>
            {message && <p className="text-success">{message}</p> }
            <div className="from-group d-flex gap-2">
                <input className="form-control" type="text" placeholder="title" onChange={(e) => setTitle(e.target.value)} value={title} />
                <input className="form-control" type="text" placeholder="description" onChange={(e) => setDescription(e.target.value)} value={description} />
                <button className="btn btn-dark" onClick={handleSubmit}>Submit</button>
            </div>
            {error && <p className="text-danger">{error}</p> }
        </div>
        <div className="row mt-3">
            <h3>Tasks</h3>
            <div className="col-md-6">
                <ul className="list-group">
                    {
                        todos.map((todo) => 
                            <li className="list-group-item bg-info d-flex justify-content-between align-items-center my-2">
                                <div className="d-flex flex-column me-2">
                                    {
                                        editId == -1 || editId !== todo._id ? <>
                                            <span className="fw-bold">{todo.title}</span>
                                            <span>{todo.description}</span>
                                        </> : <>
                                            <div className="from-group d-flex gap-2">
                                                <input className="form-control" type="text" placeholder="title" onChange={(e) => setEditTitle(e.target.value)} value={editTitle} />
                                                <input className="form-control" type="text" placeholder="description" onChange={(e) => setEditDescription(e.target.value)} value={editDescription} />
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="d-flex gap-2">
                                    {   editId == -1 || editId !== todo._id ? <>
                                            <button className="btn btn-warning" onClick={() => handleEdit(todo)}>Edit</button>
                                        </> : <>
                                            <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
                                        </>
                                    }
                                    {   editId == -1 || editId !== todo._id ? <button className="btn btn-danger" onClick={() => handleDelete(todo._id)}>Delete</button> : <button className="btn btn-danger" onClick={handleEditCancel}>Cancel</button>
                                    }
                                </div>
                            </li>
                        )
                    }
                </ul>
            </div>
        </div>
    </>
}