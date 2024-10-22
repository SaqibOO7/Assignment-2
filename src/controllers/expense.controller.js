import Expense from "../models/expense.model.js";
import { validationResult } from 'express-validator';
import parse from 'json2csv';


export const createNewExpense = async (req, res) => {

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { title, amount, createdBy, participants, splitMethod } = req.body;

        // Ensure participants are provided
        if (!participants || participants.length === 0) {
            return res.status(400).json({ error: 'Participants must be provided' });
        }

        // Handle different split methods
        if (splitMethod === 'equal') {
            const equalAmount = amount / participants.length;
            participants.forEach((p) => {
                p.amountOwed = equalAmount; // Equal split among all participants
            });

        } else if (splitMethod === 'exact') {
            // Validate that the total amount matches the sum of `amountOwed`
            const totalExactAmount = participants.reduce((sum, p) => sum + p.amountOwed, 0);
            if (totalExactAmount !== amount) {
                return res.status(400).json({ error: 'Exact amounts must add up to the total amount' });
            }

        } else if (splitMethod === 'percentage') {
            // Validate that percentages add up to 100
            const totalPercentage = participants.reduce((sum, p) => sum + p.amountOwed, 0);
            if (totalPercentage !== 100) {
                return res.status(400).json({ error: 'Percentages must add up to 100%' });
            }

            // Convert percentage to actual amounts
            participants.forEach((p) => {
                p.amountOwed = (p.amountOwed / 100) * amount; // Convert percentage to amount
            });
        } else {
            return res.status(400).json({ error: 'Invalid split method' });
        }

        // Create and save the new expense
        const expense = new Expense({
            title,
            amount,
            createdBy,
            participants,
            splitMethod
        });

        await expense.save();
        res.status(200).json(expense);

    } catch (error) {
        console.log("Error in createNewExpense controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getAnExpense = async (req, res) => {
    try {
        const { expenseId: id } = req.params;
        if (!expenseId) {
            return res.status(401).json({ error: "invalid expenseId" })
        }

        const expenses = await Expense.findById(expenseId);
        if (!expenses) {
            return res.status(400).json({ message: "expenses not found" });
        }
        res.status(200).json(expenses);
    } catch (error) {
        console.log("Error in getAnExpense controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const getOverAllExpense = async (req, res) => {
    try {
        const expenses = await Expense.find();

        if (expenses.length === 0) {
            return res.status(404).json({ message: 'No expenses found.' });
        }

        res.status(200).json(expenses);
    } catch (error) {
        console.log("Error in getOverAllExpense controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}

export const downloadSheet = async (req, res) => {
    try {

        const { expenseId: id } = req.params;
        const expense = await Expense.findById({ expenseId })
            .populate('participants.user')
            .populate('createdBy');

        if (!expense) {
            return res.status(404).json({ message: 'No expenses found.' });
        }

        // Prepare data for CSV
        const csvData = expense.participants.map(participant => ({
            title: expense.title,
            amount: expense.amount,
            createdBy: expense.createdBy.name,  // Creator's name
            user: participant.user.name,  // Participant's name
            amountOwed: participant.amountOwed,  // Amount owed by the participant
            splitMethod: expense.splitMethod,
        }));

        // Convert JSON to CSV
        const csv = parse(csvData);

        // Set response headers for CSV download
        res.header('Content-Type', 'text/csv');
        res.attachment('balance-sheet.csv'); // Filename for the download
        res.send(csv); // Send the CSV file


    } catch (error) {
        console.log("Error in downloadSheet controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}
