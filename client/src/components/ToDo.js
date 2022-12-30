import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import axios from "axios";
import getConfig from "../utils/getConfig";
import "../styles/Todo.css";
import { useSelector, useDispatch } from "react-redux";
import { getToDoThunk } from "../store/slices/ToDo.slice";
import Table from "react-bootstrap/Table";
import { AiFillEdit, AiTwotoneDelete } from "react-icons/ai";

const ToDo = () => {
  const toDo = useSelector((state) => state.ToDo);
  const dispatch = useDispatch();
  const [IsEdit, setIsEdit] = useState(false);
  const [idToDo, setIdTodo] = useState(0);

  const { register, handleSubmit, reset, setValue } = useForm();
  useEffect(() => {
    dispatch(getToDoThunk());
  }, []);

  const onSubmit = (data, todo) => {
    if (IsEdit === false) {
     if (data.title === "" || data.task === "") {
        alert("No pueden haber campos vacios");
      } else {
        axios
          .post(
            `${process.env.REACT_APP_HOST}/usuarios/task`,
            data,
            getConfig()
          )
          .then(() => dispatch(getToDoThunk()))
          .catch((error) => console.log(error.response));

        reset({
          title: "",
          task: "",
        });
      }
    } else {
      axios
        .patch(
          `${process.env.REACT_APP_HOST}/usuarios/task/${idToDo}`,
          data,
          getConfig()
        )
        .then(() => {
          setIsEdit(false);
          dispatch(getToDoThunk());
        });
    }
  };

  const editTask = (todo) => {
    setIsEdit(true);
    setIdTodo(todo.id);
    setValue("title", todo.title);
    setValue("task", todo.task);
  };

  const deleteTask = async (todo) => {
    setIdTodo(todo.id);
    await axios
      .delete(
        `${process.env.REACT_APP_HOST}/usuarios/task/${idToDo}`,
        getConfig()
      )
      .then(() => dispatch(getToDoThunk()));
  };

  return (
    <div className="containerTodo">
      <div className="formulario">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Tarea</Form.Label>
            <Form.Control
              type="text"
              placeholder="Escribe el nombre de la tarea"
              {...register("title")}
              className="title input"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Descripcion</Form.Label>
            <Form.Control
              className="input"
              as="textarea"
              rows={3}
              {...register("task")}
            />
          </Form.Group>
          <button className="submitForm" type="submit">
            Enviar
          </button>
        </Form>
      </div>
      <div>
        <br />
        <br />
        <div className="listToDo">
          <Table responsive variant="dark" className="tabla">
            <thead>
              <tr>
                <th>#</th>
                <th>Titulo</th>
                <th>Descripcion</th>
                <th className="editTitle">Edit</th>
              </tr>
            </thead>

            {toDo?.map((todo) => (
              <tbody key={todo.id}>
                <tr>
                  <td>{todo.id}</td>
                  <td>{todo.title}</td>
                  <td>{todo.task}</td>
                  <td className="editIcon" >
                    <AiFillEdit className="iconed2 icon2" onClick={() => editTask(todo)}/>
      
                    <AiTwotoneDelete className="iconed"  onClick={() => deleteTask(todo)} />
                  </td>
                </tr>
              </tbody>
            ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ToDo;
