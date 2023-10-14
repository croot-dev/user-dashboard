import { db } from "../db/"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  db.dashboard = body
})
