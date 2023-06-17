import { app } from './app'
import { tasksRoutes } from './routes/tasksRoutes'

app.register(tasksRoutes, {
  prefix: 'tasks',
})

app
  .listen({
    port: 1992,
  })
  .then(() => console.log('The server is running! 🚀'))
