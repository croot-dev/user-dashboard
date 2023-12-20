import { db } from '../db/'

export default defineEventHandler(async (event) => {
  switch (event.node.req.method) {
    case 'GET':
      return db.dashboard
    case 'POST':
      const body = await readBody(event).then(x => JSON.parse(x));
      const targetId = db.dashboard.findIndex(item => item.id === body.id)
      if (targetId > -1) {
        db.dashboard.splice(targetId, 1, body)
        return { success: true, data: db.dashboard[targetId] }
      } else {
        return { success: false, data: null }
      }
    default:
      return { success: false }
    }

})
