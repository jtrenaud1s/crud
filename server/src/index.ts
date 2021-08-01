import express from "express";
import cors from "cors";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { UserResolver } from "./schema/resolvers";
import "dotenv/config";
import cookieParser from "cookie-parser";
import User from "./entities/User";
import { verify } from "jsonwebtoken";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./auth";

const main = async () => {
  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.boog;
    if (!token) {
      return res.send({ ok: false, accessToken: "" });
    }
    let payload: any = null;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (e) {
      console.error(e);
      return res.send({ ok: false, accessToken: "" });
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return res.send({ ok: false, accessToken: "" });
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      return res.send({ ok: false, accessToken: "" });
    }

    sendRefreshToken(res, createRefreshToken(user));

    return res.send({ ok: true, accessToken: createAccessToken(user) });
  });

  console.log(process.env.ACCESS_TOKEN_SECRET);
  console.log(process.env.REFRESH_TOKEN_SECRET);

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground({
        // options
      }),
    ],
  });
  await createConnection();

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: false });

  app.listen(3001, () => {
    console.log("SERVER RUNNING ON PORT 3001");
  });
};

main().catch((err) => {
  console.log(err);
});
