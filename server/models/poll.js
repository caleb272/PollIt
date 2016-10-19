import mongoose from 'mongoose'
const Schema = mongoose.Schema

const pollSchema = new Schema({
  title: String,
  author: String,
  authorID: String,
  sortOrder: String,
  entries: Array,
  cuid: String,
  dateCreated: Number
})

export default mongoose.model('Poll', pollSchema)
