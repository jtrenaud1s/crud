import React from "react";
import { Link } from "react-router-dom";
import { setAccessToken } from "../accessToken";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

interface Props {}

const Header: React.FC<Props> = () => {
  const { data, loading, error } = useMeQuery();
  const [logout, { client }] = useLogoutMutation();

  let body: any = null;

  if (loading) {
    body = null;
  } else if (data && data.me) {
    body = <div>You are logged in as: {data.me.email}</div>;
  } else {
    console.error(error);
    console.log(data);
    body = <div>You are not logged in</div>;
  }
  return (
    <header>
      <div>
        <Link to="/register">Register</Link>
      </div>
      <div>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <Link to="/bye">Bye</Link>
      </div>
      <div>
        <Link to="/">Home</Link>
      </div>
      {body}
      {!loading && data && data.me ? (
        <button
          onClick={async () => {
            await logout();
            setAccessToken("");
            await client!.resetStore();
          }}
        >
          Logout
        </button>
      ) : null}
    </header>
  );
};

export default Header;
