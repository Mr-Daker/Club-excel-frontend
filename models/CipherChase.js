import mongoose from 'mongoose';

const CipherChaseSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Phone number is required'],
            match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
        },
        rollNo: {
            type: String,
            required: [true, 'Roll number is required'],
            trim: true,
        },
        hostelLocal: {
            type: String,
            required: [true, 'Hostel/Local status is required'],
            enum: ['hostelite', 'localite'],
        },
    },
    {
        timestamps: true,
    }
);

CipherChaseSchema.index({ email: 1 });
CipherChaseSchema.index({ rollNo: 1 });

export default mongoose.models.CipherChase || mongoose.model('CipherChase', CipherChaseSchema);
