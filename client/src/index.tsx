import React from "react";
import ReactDOM from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { getAccessToken, setAccessToken } from "./accessToken";
import App from "./App";
import { TokenRefreshLink } from "apollo-link-token-refresh";

import jwt_decode, { JwtPayload } from "jwt-decode";

const httpLink = new HttpLink({
  uri: "http://localhost:3001/graphql",
  credentials: "include",
});

const authMiddleware = new ApolloLink(
  (operation, forward) =>
    new Observable((observer) => {
      let handle: any;
      Promise.resolve(operation)
        .then((operation) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            operation.setContext({
              headers: {
                authorization:
                  getAccessToken() !== "" ? `Bearer ${getAccessToken()}` : "",
              },
            });
          }
        })
        .then(() => {
          handle = forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(observer.error.bind(observer));

      return () => {
        if (handle) handle.unsubscribe();
      };
    })
);

const thing = new TokenRefreshLink({
  accessTokenField: "accessToken",
  isTokenValidOrUndefined: () => {
    const token = getAccessToken();

    if (!token) {
      return true;
    }

    try {
      const { exp } = jwt_decode<JwtPayload>(token);

      if (!exp) return false;

      if (Date.now() >= exp * 1000) {
        return false;
      } else {
        return true;
      }
    } catch (e) {
      return false;
    }
  },
  fetchAccessToken: () => {
    return fetch("http://localhost:3001/refresh_token", {
      method: "POST",
      credentials: "include",
    });
  },
  handleFetch: (accessToken) => {
    setAccessToken(accessToken);
  },
  handleError: (err) => {
    // full control over handling token fetch Error
    console.warn("Your refresh token is invalid. Try to relogin");
    console.error(err);
  },
});

const link = ApolloLink.from([thing, authMiddleware, httpLink]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link,
  assumeImmutableResults: true,
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
