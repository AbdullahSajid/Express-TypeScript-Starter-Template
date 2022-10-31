import mongoose from 'mongoose'
import requestIp from 'request-ip'
import { RateLimiterMemory, RateLimiterMongo, RateLimiterUnion } from 'rate-limiter-flexible'
import { Request, Response } from 'express'
import { ErrorHandler } from '../types/Common'
import { RATE_LIMITER_ENABLED } from '../constants/DefaultConstants'

// redis
let anonymousRateLimiter: RateLimiterUnion,
generalRateLimiter: RateLimiterMongo

if (RATE_LIMITER_ENABLED) {
  const mongoConn = mongoose.connection
  const rateLimiterMemory = new RateLimiterMemory({
    points: 60,
    duration: 60
  })
  generalRateLimiter = new RateLimiterMongo({
    storeClient: mongoConn,
    keyPrefix: '',
    tableName: 'rlf_general',
    points: 10,
    duration: 60,
    blockDuration: 60,
    inmemoryBlockOnConsumed: 11,
    inmemoryBlockDuration: 60,
    insuranceLimiter: rateLimiterMemory
  })
  anonymousRateLimiter = new RateLimiterUnion(
    new RateLimiterMongo({
      storeClient: mongoConn,
      keyPrefix: '',
      tableName: 'rlf_anonymous',
      points: 3,
      duration: 1,
      blockDuration: 60,
      inmemoryBlockOnConsumed: 4,
      inmemoryBlockDuration: 60,
      insuranceLimiter: rateLimiterMemory
    }),
    generalRateLimiter
  )
}

export const checkAnonymousRateLimiter = async (req: Request, res: Response): Promise<void> => {
  try {
    if (anonymousRateLimiter) {
      const userIp = req.headers['x-appengine-user-ip'] || requestIp.getClientIp(req)
      if (userIp) await anonymousRateLimiter.consume(userIp as string)
    }
  } catch (rejRes: any) {
    if (rejRes instanceof Error) {
      console.error('Mongodb Error: ', rejRes)
    } else {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1
      res.set('Retry-After', String(secs))
      throw new ErrorHandler(429, 'Too many requests')
    }
  }
}

export const checkGeneralRateLimiter = async (req: Request, res: Response): Promise<void> => {
  try {
    if (generalRateLimiter) {
      if (req.body._user) await generalRateLimiter.consume(req.body._user.id)
    }
  } catch (rejRes: any) {
    if (rejRes instanceof Error) {
      console.error('Mongodb Error: ', rejRes)
    } else {
      const secs = Math.round(rejRes.msBeforeNext / 1000) || 1
      res.set('Retry-After', String(secs))
      throw new ErrorHandler(429, 'Too many requests')
    }
  }
}
