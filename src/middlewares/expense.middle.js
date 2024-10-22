import { body } from 'express-validator';

// Middleware to validate expense input
export const validateExpense = [
    body('title').notEmpty().withMessage('Title is required'),
    body('amount')
        .isNumeric().withMessage('Amount must be a number')
        .custom(value => value > 0).withMessage('Amount must be greater than 0'),
    body('createdBy').notEmpty().withMessage('User ID (createdBy) is required'),
    body('participants').isArray({ min: 1 }).withMessage('At least one participant is required'),
    body('splitMethod').isIn(['equal', 'exact', 'percentage']).withMessage('Invalid split method'),
];