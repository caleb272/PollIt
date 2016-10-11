import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  name: String,
  user_id: String
})

export default mongoose.model('User', userSchema)
