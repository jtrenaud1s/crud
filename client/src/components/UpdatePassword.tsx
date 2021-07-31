import { useMutation } from "@apollo/client";
import React, { useState } from "react";
import { UPDATE_PASSWORD } from "../graphql/mutations";

function UpdatePassword() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [updatePassword, {error}] = useMutation(UPDATE_PASSWORD);
  return (
    <div>
        {error && <span>{error}</span>}
      <input
        type="text"
        placeholder="Username..."
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="Current Password..."
        onChange={(e) => {
          setCurrentPassword(e.target.value);
        }}
      />
      <input
        type="password"
        placeholder="New Password..."
        onChange={(e) => {
          setNewPassword(e.target.value);
        }}
      />
      <button
        onClick={() => {
          updatePassword({
            variables: {
              username: username,
              oldPassword: currentPassword,
              newPassword: newPassword,
            },
          });
        }}>
        Update Password
      </button>
    </div>
  );
}

export default UpdatePassword;
