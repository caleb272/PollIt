import mongoose from 'mongoose'
const Schema = mongoose.Schema

const nonAuthVotesSchema = new Schema({
  ip: String
})
