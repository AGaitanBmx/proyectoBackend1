import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://agustingaitan4130:txyRyEdTDpyMas57@backend1.gf1xv.mongodb.net/';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Conectado a MongoDB Atlas');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;