import mongoose, { Document } from 'mongoose'

export type OwnerDocument = Document & {
  firstName: string
  lastName: string
  role: string
  email: string
  properties?: mongoose.Types.ObjectId[]
}

export const OwnerSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  role: { type: String, default: 'owner' },
  email: { type: String, required: true, unique: true },
  properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Room' }],
})
