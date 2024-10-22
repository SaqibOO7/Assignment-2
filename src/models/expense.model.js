import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubUser',
        required: true
    },
    participants: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'SubUser'
            },
            amountOwed: {
                type: Number,
                required: true
            },
        },
    ],
    splitMethod: {
        type: String,
        enum: ['equal', 'exact', 'percentage'],
        required: true
    },
}, {timestamps: true});

const Expense = mongoose.model('Expense', ExpenseSchema);

export default Expense
