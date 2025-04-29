import { Hono } from 'hono'
import { userRoutes } from './users'

export const routes = new Hono()

routes.route('/users', userRoutes)
