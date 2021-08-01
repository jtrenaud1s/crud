import React from "react";
import { useByeQuery } from "../generated/graphql";

interface Props {}

const Bye: React.FC<Props> = () => {
  const { data, loading, error } = useByeQuery();

  if (loading) {
    return <div>loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>{JSON.stringify(error)}</div>;
  }

  if (!data) {
    return <div>No data</div>;
  }
  return <div>{data.bye}</div>;
};

export default Bye;
