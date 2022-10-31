import { Request, Response, NextFunction } from 'express'
import AdminService from '../services/AdminService'

export const registerAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.registerAdmin(req.body)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.loginAdmin(req.body)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.updateAdmin(req.params.adminId, req.body)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const updateAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.updateAdminProfile(req.body)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const updateAdminPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.updateAdminPassword(req.body)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.deleteAdmin(req.params.adminId)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const getAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.getAdmin(req.params.adminId)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const getAdminProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.getAdminProfile(req.body)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}

export const listAdmins = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await AdminService.listAdmins(req.query)
    return res.json({ success: true, ...response })
  }
  catch (e) {
    next(e)
  }
}
