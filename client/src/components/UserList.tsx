import { useQuery } from "@apollo/client";
import React from "react";
import { GET_ALL_USERS } from "../graphql/queries";

function UserList() {
  const { data } = useQuery(GET_ALL_USERS);
  return (
    <div>
      {data &&
        data.getAllUsers.map((user: any) => {
          return (
            <div>
              {user.name} / {user.username}
            </div>
          );
        })}
    </div>
  );
}

export default UserList;
