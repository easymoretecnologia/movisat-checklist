import NextAuth from "next-auth"
import { JWT } from "next-auth/jwt"
import UserModel from "@/entities/user.entity"

declare module "next-auth" {
  interface User extends UserModel {
    accessToken: string
  }

  interface Session {
    user: UserModel
    accessToken: string
    expires: string
  }
}

declare module "next-auth/jwt" {
  interface JWT extends UserModel {
    accessToken: string
  }
}