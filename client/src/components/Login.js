import React from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "../styles/login.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getUserThunk } from "../store/slices/User.slice";
import imagen from "../images/Sin título-1.png";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    axios
      .post(`${process.env.REACT_APP_HOST}/usuarios/login`, data)
      .then((res) => {
        localStorage.setItem("token", res.data.data.token);
        navigate(`/${res.data.data.user.id}`);
      });
    dispatch(getUserThunk(data)).catch((error) => {
      alert(`${error.response?.data.message}`);
    });

    reset({
      email: "",
      password: "",
    });
  };

  return (
    <div className="principal">
      <div className="imgContainer">
        <img src={imagen} alt="" />
      </div>
      <div className="containerLogin ">
        <h1 className="titleLogin ">User App</h1>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3 " controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              {...register("email")}
            />
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              {...register("password")}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login;
