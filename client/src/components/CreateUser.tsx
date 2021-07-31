import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { CREATE_USER } from "../graphql/mutations";

const CreateUser = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [createUser, { error }] = useMutation(CREATE_USER);
  return (
    <div className="createUser">
      <input
        type="text"
        placeholder="name"
        onChange={(e) => {
          setName(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="password"
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button
        onClick={() => {
          createUser({
            variables: { name: name, username: username, password: password },
          }).catch((err) => {
              console.error(err)
              console.error(error)
          });
        }}>
        Create User
      </button>
    </div>
  );
};

export default CreateUser;
