import { db } from "../db/"

export default defineEventHandler(async (event) => {
  return db.dashboard
})
