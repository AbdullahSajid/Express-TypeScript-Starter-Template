import { model, Schema, Document, PaginateModel } from "mongoose"
import { IAdmin } from '../types/Common'
import { getNumericNanoId } from '../utils/Common'
import { mongooseErrorHandler } from '../utils/DBUtils'
import mongoosePaginate from 'mongoose-paginate-v2'

export type AdminDocument = IAdmin & Document

const AdminSchema = new Schema<IAdmin, PaginateModel<AdminDocument>>({
  _id: { type: String, required: true, default: () => getNumericNanoId(6) },
  name: { type: String, required: true, trim: true, minlength: 4, maxlength: 25 },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 40 },
  password: { type: String, required: true, select: false },
  role: { type: String, required: true, enum: ['spradmin', 'admin'], default: 'admin' }
}, { timestamps: true, versionKey: false })


AdminSchema.post('save', function(error: any, doc: Document, next: any) {
  mongooseErrorHandler(error)
})
AdminSchema.post(/findOneAndUpdate|updateOne|updateMany/g, function(error: any, res: any, next: any) {
  mongooseErrorHandler(error)
})

AdminSchema.set('toObject', { virtuals: true })
AdminSchema.set('toJSON', { virtuals: true })

AdminSchema.plugin(mongoosePaginate)

export default model<IAdmin, PaginateModel<AdminDocument>>('Admin', AdminSchema, 'admins')