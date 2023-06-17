import { FastifyRequest, FastifyReply } from 'fastify'
import { z } from 'zod'
import { prismaClient } from '../../prisma/prismaClient'
import { textInternalServerError } from '../utils/textUtils'

async function createTasks(request: FastifyRequest, reply: FastifyReply) {
  const schemaTasks = z.object({
    title: z.string(),
    description: z.string(),
  })

  const { title, description } = schemaTasks.parse(request.body)

  try {
    const task = await prismaClient.tasks.create({
      data: {
        title,
        description,
      },
    })
    reply.status(201).send(task)
  } catch (error) {
    console.log(error)
    reply.status(500).send({
      message: textInternalServerError,
    })
  }
}

async function listTasks(request: FastifyRequest, reply: FastifyReply) {
  try {
    const tasks = await prismaClient.tasks.findMany()
    reply.send(tasks)
  } catch (error) {
    console.log(error)
    reply.status(500).send({
      message: textInternalServerError,
    })
  }
}

async function upTask(request: FastifyRequest, reply: FastifyReply) {
  const schemaTasks = z.object({
    title: z.string(),
    description: z.string(),
  })

  const { title, description } = schemaTasks.parse(request.body)

  const schemaID = z.object({
    id: z.string(),
  })

  const { id } = schemaID.parse(request.params)

  try {
    const task = await prismaClient.tasks.findFirst({
      where: {
        id,
      },
    })
    const newTitle = title || task?.title
    const newDescription = description || task?.description
    const newTask = await prismaClient.tasks.update({
      where: {
        id,
      },
      data: {
        title: newTitle,
        description: newDescription,
      },
    })
    reply.send(newTask)
  } catch (error) {
    console.log(error)
    reply.status(500).send({ message: textInternalServerError })
  }
}

async function done(request: FastifyRequest, reply: FastifyReply) {
  const schemaID = z.object({
    id: z.string(),
  })

  const { id } = schemaID.parse(request.params)
  try {
    const task = await prismaClient.tasks.findFirst({
      where: {
        id,
      },
    })
    const newTask = await prismaClient.tasks.update({
      where: {
        id,
      },
      data: {
        done: !task?.done,
      },
    })
    reply.status(200).send(newTask)
  } catch (error) {
    console.log(error)
    reply.status(500).send({ message: textInternalServerError })
  }
}

async function deleteTask(request: FastifyRequest, reply: FastifyReply) {
  const schemaID = z.object({
    id: z.string(),
  })

  const { id } = schemaID.parse(request.params)

  try {
    await prismaClient.tasks.delete({
      where: {
        id,
      },
    })
    reply.status(200).send()
  } catch (error) {
    console.log(error)
    reply.status(500).send({ message: textInternalServerError })
  }
}

export { createTasks, listTasks, upTask, done, deleteTask }
