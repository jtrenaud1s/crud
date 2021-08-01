import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { getAccessToken, setAccessToken } from "../accessToken";
import { MeDocument, MeQuery, useLoginMutation } from "../generated/graphql";

const Login: React.FC<RouteComponentProps> = ({ history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login] = useLoginMutation();

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log("form submitted");
        console.log(email, password);

        const response = await login({
          variables: {
            email,
            password,
          },
          update: (store, { data }) => {
            if (!data) {
              return null;
            }

            console.log("store");
            console.log(data);
            store.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                me: data.login.user,
              },
            });
          },
        });

        if (response && response.data) {
          setAccessToken(response.data.login.accessToken);
          console.log("set access token");
          console.log(getAccessToken());
        }

        history.push("/");
      }}>
      <div>
        <input
          value={email}
          type="text"
          placeholder="email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <input
          value={password}
          type="password"
          placeholder="password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
