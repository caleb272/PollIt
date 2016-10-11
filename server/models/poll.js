import mongoose from 'mongoose'
const Schema = mongoose.Schema

const pollSchema = new Schema({
  title: String,
  author: String,
  entries: Array,
  cuid: String,
  dateCreated: Date
})

export default mongoose.model('Poll', pollSchema)
