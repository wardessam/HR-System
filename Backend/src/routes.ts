import { Router, Request, Response } from 'express';
import Employee, { IEmployee } from './employee.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const router: Router = Router();

router.post('/employees/register', async (req: Request, res: Response) => {
    const { name, age, email, position, group, password } = req.body;
  
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
        position,
        group,
        password,
      });
  
      // Save employee with hashed password
      await employee.save();
  
      res.status(201).json({ message: 'Employee registered successfully' });
  
    } catch (error : any) {
      console.error('Registration error:', error);
      res.status(500).json({ error: error.message });
    }
  });
  
  // Login endpoint
  router.post('/employees/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
     console.log("here",email,password)
    try {
      // Check if employee exists
      const employee: IEmployee | null = await Employee.findOne({ email });
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
  
      // Validate password
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      // Check if employee is in the HR group
      if (employee.group !== 'HR') {
        return res.status(403).json({ message: 'Access denied' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        { id: employee._id },
        process.env.JWT_SECRET || 'jwt_secret_key', // Replace with your actual JWT secret
        { expiresIn: '1h' } // Token expiration time
      );
  
      res.json({ token });
  
    } catch (error : any) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message });
    }
  });
// Create a Employee
router.post('/employees', async (req: Request, res: Response) => {
  try {
    const newEmployee: IEmployee = new Employee(req.body);
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (error : any) {
    res.status(400).json({ error: error.message });
  }
});

// Get all Employees
router.get('/employees', async (req: Request, res: Response) => {
  try {
    const Employees: IEmployee[] = await Employee.find();
    res.json(Employees);
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
});

// Get Employee by ID
router.get('/employees/:id', async (req: Request, res: Response) => {
  try {
    const employee: IEmployee | null = await Employee.findById(req.params.id);
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
});

// Update Employee by ID
router.put('/employees/:id', async (req: Request, res: Response) => {
  try {
    const updatedEmployee: IEmployee | null = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedEmployee) {
      res.json(updatedEmployee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Employee by ID
router.delete('/employees/:id', async (req: Request, res: Response) => {
  try {
    const deletedEmployee: IEmployee | null = await Employee.findByIdAndDelete(req.params.id);
    if (deletedEmployee) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error : any) {
    res.status(500).json({ error: error.message });
  }
});
// Add Attendance endpoint
router.post('/attendance', async (req: Request, res: Response) => {
  const { employeeId, date } = req.body;

  try {
    // Find the employee by ID
    const employee: IEmployee | null = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Add attendance to the employee's record
    // For example, assume attendance is stored in an array within the Employee model
    employee.attendance.push({ date: new Date(date) });

    // Save the updated employee document
    await employee.save();

    return res.status(200).json({ message: 'Attendance added successfully' });

  } catch (error: any) {
    console.error('Error adding attendance:', error);
    return res.status(500).json({ error: 'Failed to add attendance' });
  }
});

export default router;
