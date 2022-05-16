import mongoose from 'mongoose'



const connectionDB = (url) => {
    return mongoose.connect(url)
}


export default connectionDB
