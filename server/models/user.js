import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  username: String,
  github_id: String
})

export default mongoose.model('User', userSchema)
