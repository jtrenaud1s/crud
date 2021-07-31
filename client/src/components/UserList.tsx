import { useMutation, useQuery } from "@apollo/client";
import React from "react";
import { DELETE_USER } from "../graphql/mutations";
import { GET_ALL_USERS } from "../graphql/queries";

function UserList() {
  const { data } = useQuery(GET_ALL_USERS);

  const [deleteUser, {error}] = useMutation(DELETE_USER);

  return (
    <div>
      {data &&
        data.getAllUsers.map((user: any, key: any) => {
          return (
            <div key={key}>
              {user.name} / {user.username}
              <button
                onClick={() => {
                  console.log(user)
                  deleteUser({
                    variables: { id: user.id },
                  })
                }}>
                Delete
              </button>
            </div>
          );
        })}
    </div>
  );
}

export default UserList;
