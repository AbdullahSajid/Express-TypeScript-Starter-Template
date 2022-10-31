import { Request, Response, NextFunction } from 'express'
import { ErrorHandler } from '../types/Common'
import { verifyJWT, verifyBT } from '../utils/AuthUtils'
import { checkAnonymousRateLimiter, checkGeneralRateLimiter } from '../config/rateLimiter'

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.headers && req.headers.authorization) {
      if (req.headers.authorization.split(' ')[0] === 'JWT') {
        const token = req.headers.authorization.split(' ')[1]
        const user = await verifyJWT(token)
        req.body._user = user
        return next()
      }
      else if (req.headers.authorization.split(' ')[0] === 'Bearer') {
        const token = req.headers.authorization.split(' ')[1]
        const user = verifyBT(token)
        if (!req.body._user) req.body._user = user
        return next()
      }
    }
    throw new ErrorHandler(401, 'Authorization Header Not Present')
  } catch (e) {
    next(e)
  }
}

export const authorize = (roles: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      roles = Array.isArray(roles) ? [...new Set(roles)] : [roles]
      if (roles.includes('all') || 
        (roles.includes('admin') && req.body._user.role === 'spradmin') ||
        roles.includes(req.body._user.role)) {
        await checkGeneralRateLimiter(req, res)
        next()
      }
      else throw new ErrorHandler(403, 'Unauthorized')
    }
    catch (e) {
      next(e)
    }
  }
}

export const anonymousAuthorize = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await checkAnonymousRateLimiter(req, res)
    next()
  }
  catch (e) {
    next(e)
  }
}
