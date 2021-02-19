"use strict"
import UserModel from "@models/User.model"
import { authService } from "@services/auth/index"
import userService from "@services/domain/User/index"

const users: Partial<UserModel>[] = [
  { login: "v0vcheese@account.com", password: authService.generatePassword('12345'), name: "Володя" },
]

export const up = async () => {
  for (const user of users) {
    const findUser = await userService.findOne({ where: { login: user.login } })
    if (!findUser) {
      await userService.create(user)
    }
  }
}

export const down = async () => {
  for (const user of users) {
    const findUser = await userService.findOne({ where: { login: user.login } })
    await findUser.destroy()
  }
}
