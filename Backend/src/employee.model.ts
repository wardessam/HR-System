import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Define TypeScript interface
export interface IEmployee extends Document {
  name: string;
  age: number;
  email: string;
  password: string;
  group: string;
  attendance: { date: Date }[];
}

// Define MongoDB schema
const EmployeeSchema: Schema = new Schema({
  name: { type: String, required: true },
  age: { type: Number, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  group: { type: String, required: true },
  attendance: [{ date: { type: Date, default: Date.now } }] 
});
EmployeeSchema.pre<IEmployee>('save', async function (next) {
    if (!this.isModified('password')) {
      return next();
    }
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (error : any) {
      next(error);
    }
  });
  
// Create and export Mongoose model
const Employee = mongoose.model<IEmployee>('Employee', EmployeeSchema);
export default Employee;
