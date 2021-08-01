import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  Int,
} from "type-graphql";
import User from "../entities/User";
import { hash, compare } from "bcrypt";
import { ObjectType, Field } from "type-graphql";
import { sign, verify } from "jsonwebtoken";
import { AppContext } from "../AppContext";
import {
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "../auth";
import { isAuth } from "../isAuthMiddleware";
import { getConnection, getRepository } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string;

  @Field(() => User)
  user!: User;
}

@Resolver()
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => String)
  @UseMiddleware(isAuth)
  bye(@Ctx() { payload }: AppContext) {
    console.log(payload!);
    return `your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  users() {
    return User.find();
  }

  @Query(() => User, { nullable: true })
  me(
    @Ctx()
    context: AppContext
  ) {
    const authorization = context.req.headers["authorization"];

    if (!authorization) {
      return null;
    }

    try {
      const token = authorization.split(" ")[1];
      const payload: any = verify(token, process.env.ACCESS_TOKEN_SECRET!);
      const user = User.findOne(payload.userId);
      return user;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email")
    email: string,

    @Arg("password")
    password: string
  ) {
    const hashedPassword = await hash(password, 12);

    await User.insert({
      email,
      password: hashedPassword,
    }).catch((err) => {
      console.error(err);
      return false;
    });
    return true;
  }

  @Mutation(() => Boolean)
  async revokeRefreshTokensForUser(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: AppContext) {
    sendRefreshToken(res, "");
    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email")
    email: string,

    @Arg("password")
    password: string,

    @Ctx() { res }: AppContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("User doesn't exist!");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Incorrect password!");
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
      user: user,
    };
  }
}
