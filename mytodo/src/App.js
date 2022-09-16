import React, { useState, useEffect } from "react";
import "./App.css";
import { Button, Card, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import trash from "./trashh.png";
import editimg from "./edit.png";

const EditModal = ({ id, setEdit }) => {
  const [task, setTask] = useState("");
  const updatetask = async(e) => {
    e.preventDefault();
    if (task !== "") {
      await axios
        .patch("http://localhost:8080/task/" + id, {
          task: task,
        })
        .then((res) => console.log(res.data.data));
      setEdit(false);
    }
  };
  return (
    <div className="editHolder">
      <div className="edit_box">
        <span onClick={() => setEdit(false)}>x</span>
        <h1>Edit Task</h1>
        <input type="text" placeholder="Update task" onChange={(e) => setTask(e.target.value)} />
        <button
          onClick={(e) => {
            updatetask(e);
          }}
        >
          Apply Changes
        </button>
      </div>
    </div>
  );
};

function Todo({ todo, index, removeTodo, setID, setEdit }) {
  return (
    <div className="todo">
      <span>{todo.Task}</span>
      <div>
        <Button
          style={{ marginRight: "10px" }}
          variant="outline-secondary"
          onClick={() => removeTodo(index)}
        >
          <img src={trash} alt="trash" style={{ maxWidth: "30px" }} />
        </Button>
        <Button
          variant="outline-secondary"
          onClick={() => {
            setEdit();
            setID(todo.id);
          }}
        >
          <img src={editimg} alt="trash" style={{ maxWidth: "30px" }} />
        </Button>
      </div>
    </div>
  );
}

function FormTodo({ addTodo }) {
  const [value, setValue] = React.useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>
          <b>Add Todo</b>
        </Form.Label>
        <Form.Control
          type="text"
          className="input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add new todo"
        />
      </Form.Group>
      <Button variant="primary mt-3 mb-3" type="submit">
        Submit
      </Button>
    </Form>
  );
}

function App() {
  const [todos, setTodos] = useState([]);
  const [edit, setEdit] = useState(false);
  const [id, setID] = useState(null);
  useEffect(() => {
    axios
      .get("http://localhost:8080/task")
      .then((res) => setTodos(res.data.data))
      .catch((err) => console.log(err));
  }, [edit]);
  const addTodo = async (text) => {
    await axios
      .post("http://localhost:8080/task", {
        task: text,
      })
      .then((res) => setTodos(res.data.data.sort()))
      .catch((err) => console.log(err));
  };

  const markTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].isDone = true;
    setTodos(newTodos);
  };

  const removeTodo = async (id) => {
    await axios
      .delete("http://localhost:8080/task/" + id)
      .catch((err) => console.log(err));

    await axios
      .get("http://localhost:8080/task")
      .then((res) => setTodos(res.data.data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="app">
      {edit ? <EditModal id={id} setEdit={setEdit} /> : null}
      <div className="container">
        <h1 className="text-center mb-4">Todo List</h1>
        <FormTodo addTodo={addTodo} />
        <div>
          {todos.length > 0
            ? todos.map((todo, index) => (
                <Card>
                  <Card.Body>
                    <Todo
                      key={index}
                      index={index}
                      todo={todo}
                      markTodo={markTodo}
                      setID={setID}
                      setEdit={() => setEdit(true)}
                      removeTodo={() => removeTodo(todo.id)}
                    />
                  </Card.Body>
                </Card>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default App;
