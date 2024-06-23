// hrRoutes.ts

import { Router } from 'express';
import { addEmployee, editEmployee } from './hrController';

const router: Router = Router();

// Route to add an employee
router.post('/employees', addEmployee);

// Route to edit an employee
router.put('/employees/:id', editEmployee);

router.post('/attendance', editEmployee);


export default router;
