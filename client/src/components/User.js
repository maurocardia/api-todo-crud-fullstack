import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import "../styles/user.css";
import Form from "react-bootstrap/Form";
import { useNavigate, useParams } from "react-router-dom";
import {
  AiOutlineUser,
  AiOutlineStar,
  AiOutlineAppstore,
} from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useForm } from "react-hook-form";
import getConfig from "../utils/getConfig";
import { useDispatch, useSelector } from "react-redux";
import {
  editUserThunk,
  getUserInSessionThunk,
} from "../store/slices/User.slice";
import ToDo from "./ToDo";
import { setView } from "../store/slices/View.slice";

const User = () => {
  const { handleSubmit } = useForm();
  const userInsession = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const view = useSelector((state) => state.view);

  const { id } = useParams();
  const [characters, setCharacters] = useState([]);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [favoriteList, setFavoriteList] = useState();
  const [user, setUser] = useState([]);
  const [array, setArray] = useState([]);
  const [as, setAs] = useState();

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [adress, setAdress] = useState("");
  const [city, setCity] = useState("");
  const [activeFavorites, setActiveFavorites] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (user) => {
    setName(user.name);
    setBirthdate(user.birthdate);
    setAdress(user.adress);
    setCity(user.city);
    setShow(true);
  };

  useEffect(() => {
    dispatch(getUserInSessionThunk(id));
    axios
      .get(`${process.env.REACT_APP_HOST}/personajes`, getConfig())
      .then((res) => {
        setFavoriteList(res.data.data);
      })
      .catch((error) => console.error(error));

    axios
      .get(`https://rickandmortyapi.com/api/character/?page=2`)
      .then((res) => setCharacters(res.data.results));

    axios
      .get(`${process.env.REACT_APP_HOST}/personajes`, getConfig())
      .then((res) => {
        setFavoriteList(res.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  const buttonStatus = (status) => {
    if (status === "Alive") {
      return <div className="statusAlived"></div>;
    } else if (status === "Dead") {
      return <div className="statusDead"></div>;
    } else {
      return <div className="statusUnknown"></div>;
    }
  };
  const userEdit = {
    name: name,
    city,
    birthdate,
    adress,
  };

  const onSubmit = () => {
    dispatch(editUserThunk(id, userEdit));
    handleClose();
    alert("se ha modificado el usuario con exito!");
  };

  const arrayCharacteres = () => {
    favoriteList.map((favorite) => {
      const character = favorite.ref_api;
      array.push(character);
    });
    axios
      .get(`${process.env.REACT_APP_HOST}/personajes`, getConfig())
      .then((res) => setFavoriteList(res.data.data))
      .catch((error) => console.error(error));
  };

  const toFavorites = (id) => {
    dispatch(setView("favorites"));
    arrayCharacteres();
    if (array.length < 2) {
      alert("agrege por lo menos dos personaje!!");
    } else {
      axios
        .get(`https://rickandmortyapi.com/api/character/${array}`)
        .then((res) => {
          setAs(res.data);
        });
      setActiveFavorites(true);
    }
  };

  const refreshList = () => {
    dispatch(setView("personajes"));
    axios
      .get(`https://rickandmortyapi.com/api/character/?page=2`)
      .then((res) => setCharacters(res.data.results));
    setActiveFavorites(false);
  };

  const gocharacterDetails = (id) => {
    const idCharacter = {
      id: id,
    };

    axios.post(
      `${process.env.REACT_APP_HOST}/personajes`,
      idCharacter,
      getConfig()
    );
    navigate(`/user/${id}`);
  };

  const viewToDo = () => {
    dispatch(setView("todo"));
  };

  const viewList = () => {
    if (view === "favorites") {
      return (
        <>
          <div className="containerCharacter">
            {as?.map((character) => (
              <div className="character" key={character.id}>
                <img
                  src={character.image}
                  alt=""
                  onClick={() => gocharacterDetails(character.id)}
                />
                <h5>{character.name}</h5>
                <div className="containerStatus">
                  <div>
                    <p>{character.status}</p>
                  </div>
                  {buttonStatus(character.status)}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    } else if (view === "personajes") {
      return (
        <>
          <div className="containerCharacter">
            {characters?.map((character) => (
              <div className="character" key={character.id}>
                <img
                  src={character.image}
                  alt=""
                  onClick={() => gocharacterDetails(character.id)}
                />
                <h5>{character.name}</h5>
                <div className="containerStatus">
                  <div>
                    <p>{character.status}</p>
                  </div>
                  {buttonStatus(character.status)}
                </div>
              </div>
            ))}
          </div>
        </>
      );
    } else {
      return (
        <>
          <ToDo />
        </>
      );
    }
  };

  return (
    <div className="containerCharacterPage">
      <div className="containerUser">
        <div className="containerBanner">
          <div className="banner"></div>
        </div>
        <div className="secondBar">
          <div className="user">
            <div className="userIcon">
              <AiOutlineUser />
            </div>
            <h5 className="userInSession">{userInsession?.name}</h5>
          </div>
          <div className="todosText">
            <BiTask />
            <span onClick={viewToDo}>TODOS</span>
          </div>

          <div className="controlBar">
            <button className="selectPersonaje" onClick={() => toFavorites()}>
              <AiOutlineStar /> Favoritos
            </button>
          </div>
          <div className="controlBar">
            <button
              className="selectPersonaje buttonRigth"
              onClick={refreshList}
            >
              <AiOutlineAppstore /> <span>Personajes</span>{" "}
            </button>
          </div>
          <div className="editUserForm">
            <button
              className="buttonEdit"
              variant="primary"
              onClick={handleShow}
            >
              Edit User
            </button>

            <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Editar informacion</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput1"
                  >
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={userInsession?.name}
                      autoFocus
                      value={name || ""}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput2"
                  >
                    <Form.Label>Adress</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={
                        !userInsession.adress
                          ? "CARRERA 50 # 3-28"
                          : userInsession.adress
                      }
                      autoFocus
                      value={adress || ""}
                      onChange={(e) => setAdress(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group
                    className="mb-3"
                    controlId="exampleForm.ControlInput3"
                  >
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={
                        !userInsession.city ? "Cali" : userInsession.city
                      }
                      autoFocus
                      value={city || ""}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <Form.Group
                      className="mb-3"
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Label>Birthdate</Form.Label>
                      <Form.Control
                        type={!userInsession.birthdate ? "date" : "text"}
                        placeholder={new Date(
                          userInsession.birthdate
                        ).toLocaleDateString()}
                        autoFocus
                        value={birthdate || ""}
                        onChange={(e) => setBirthdate(e.target.value)}
                      />
                    </Form.Group>
                    <br />
                    <Button variant="primary" type="submit" onClick={onSubmit}>
                      Save Changes
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                      Close
                    </Button>
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer></Modal.Footer>
            </Modal>
          </div>
        </div>
      </div>
      {/*<ToDo/>*/}

      {viewList()}
    </div>
  );
};

export default User;
