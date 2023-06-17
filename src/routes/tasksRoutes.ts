import { FastifyInstance } from 'fastify'
import {
  createTasks,
  deleteTask,
  done,
  listTasks,
  upTask,
} from '../controllers/tasksControllers'

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/', createTasks)
  app.get('/', listTasks)
  app.put('/:id', upTask)
  app.patch('/:id', done)
  app.delete('/:id', deleteTask)
}
