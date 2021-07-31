import React from "react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import "./App.css";
import CreateUser from "./components/CreateUser";
import UserList from "./components/UserList";

const App = () => {
  const client = new ApolloClient({
    uri: "http://localhost:3001/graphql",
    cache: new InMemoryCache(),
  });

  return (
    <ApolloProvider client={client}>
      <UserList />
      <CreateUser />
    </ApolloProvider>
  );
};

export default App;
