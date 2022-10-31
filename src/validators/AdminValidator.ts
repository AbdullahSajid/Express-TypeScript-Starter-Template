import { Request, Response, NextFunction } from 'express'
import { body, param, query } from 'express-validator'
import { validate } from '../utils/Common'

const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations = [
      body('name').isString().trim().notEmpty(),
      body('email').isEmail().normalizeEmail(),
      body('password').isString().isLength({ min: 8 }).withMessage('Password must not be less than (8) characters'),
      body('confirmPassword').isString().isLength({ min: 8 }).bail().custom((value: string) => {
        if (value !== req.body.password) throw new Error('Passwords do not match')
        return true
      })
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations = [
      body('email').isEmail().normalizeEmail(),
      body('password').isString().notEmpty(),
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations = [
      param('adminId').isString().trim().notEmpty(),
      body('name').optional({ checkFalsy: true }).isString().trim(),
      body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail()
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const updateAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations = [
      body('name').optional({ checkFalsy: true }).isString().trim(),
      body('email').optional({ checkFalsy: true }).isEmail().normalizeEmail()
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const updateAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations = [
      body('currentPassword').isString().notEmpty(),
      body('newPassword').isString().isLength({ min: 8 }).withMessage('Password must not be less than (8) characters'),
      body('confirmNewPassword').isString().isLength({ min: 8 }).bail().custom((value: string) => {
        if (value !== req.body.newPassword) throw new Error('Passwords do not match')
        return true
      })
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations = [
      param('adminId').isString().trim().notEmpty()
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations: any = [
      param('adminId').isString().trim().notEmpty()
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations: any = []
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

const listAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validations = [
      query("adminId").optional({ checkFalsy: true }).isString().trim(),
      query("name").optional({ checkFalsy: true }).isString().trim(),
      query("email").optional({ checkFalsy: true }).isString().trim(),
      query("searchKeyword").optional({ checkFalsy: true }).isString().trim(),
      query('page').default(1).isInt(),
      query('limit').default(10).isInt()
    ]
    await validate(req, validations)
    next()
  } catch (e) {
    next(e)
  }
}

export default {
  registerAdmin,
  loginAdmin,
  updateAdmin,
  updateAdminProfile,
  updateAdminPassword,
  deleteAdmin,
  getAdmin,
  getAdminProfile,
  listAdmins
}
