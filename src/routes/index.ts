// routes/index.js
import Admin from './Admin'

import { Router } from 'express'
const router = Router()

// api/v1/app/admin
router.use('/admin', Admin)

export default router
