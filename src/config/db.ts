import mongoose from 'mongoose'

export const connectDB = () => {
  mongoose.connect(`${process.env.MONGODB_URL}/testDB?retryWrites=true&w=majority&ssl=true`, {
    minPoolSize: 10,
    serverSelectionTimeoutMS: 25000
  }).catch(err => {
    console.log('Database connection error: ', err)
  })
  
  mongoose.connection.on('connected', () => console.log('Database connected'))
  mongoose.connection.on('error', () => console.log('Database error'))
}