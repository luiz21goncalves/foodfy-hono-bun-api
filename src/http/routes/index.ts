import { Hono } from 'hono'
import { authRoutes } from './auth'
import { userRoutes } from './users'

export const routes = new Hono()

routes.route('/users', userRoutes)
routes.route('/auth', authRoutes)
