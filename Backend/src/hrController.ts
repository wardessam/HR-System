import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Employee, { IEmployee } from './employee.model';

// Add an employee
export const addEmployee = async (req: Request, res: Response) => {
  const { name, age, email, group, password } = req.body;

  try {
    // Check if employee already exists
    let employee: IEmployee | null = await Employee.findOne({ email });
    if (employee) {
      return res.status(400).json({ message: 'Employee already exists' });
    }

    // Create new employee instance
    employee = new Employee({
      name,
      age,
      email,
      group,
      password,
    });

    // Save employee with hashed password
    await employee.save();

    res.status(201).json({ message: 'Employee added successfully' });

  } catch (error :any) {
    console.error('Add employee error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Edit an employee
export const editEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, email, group } = req.body;

  try {
    // Find employee by ID and update
    let employee: IEmployee | null = await Employee.findByIdAndUpdate(id, {
      name,
      age,
      email,
      group,
    }, { new: true });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
   
    res.json({ message: 'Employee updated successfully', employee });

  } catch (error :any) {
    console.error('Edit employee error:', error);
    res.status(500).json({ error: error.message });
  }
};
export const addAttendance = async (req: Request, res: Response) => {
  const { employeeId, date } = req.body;

  try {
    // Find the employee by ID
    const employee: IEmployee | null = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Add attendance to the employee's record
    employee.attendance.push({ date: new Date(date) });

    // Save the updated employee document
    await employee.save();

    return res.status(200).json({ message: 'Attendance added successfully' });

  } catch (error: any) {
    console.error('Error adding attendance:', error);
    return res.status(500).json({ error: 'Failed to add attendance' });
  }
};