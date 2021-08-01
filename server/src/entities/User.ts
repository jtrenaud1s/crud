import { BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import { ObjectType, Field, Int } from "type-graphql";

@ObjectType()
@Entity("users")
export default class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  email!: string;

  @Field()
  @Column()
  password!: string;

  @Field()
  @Column("int", { default: 0})
  tokenVersion!: number
}
