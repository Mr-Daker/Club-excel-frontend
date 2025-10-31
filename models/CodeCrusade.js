import mongoose from 'mongoose';

const CodeCrusadeSchema = new mongoose.Schema(
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
        instituteEmail: {
            type: String,
            required: [true, 'Institute email is required'],
            lowercase: true,
            trim: true,
            validate: {
                validator: function (v) {
                    return v.includes('.edu');
                },
                message: 'Institute email must contain .edu',
            },
        },
        rollNumber: {
            type: String,
            required: [true, 'Roll number is required'],
            trim: true,
        },
        hostelLocal: {
            type: String,
            required: [true, 'Hostel/Local status is required'],
            enum: ['hostelite', 'localite'],
        },
        groupName: {
            type: String,
            required: [true, 'Group name is required'],
            enum: ['Group 1', 'Group 2', 'Group 3'],
        },
        hackId: {
            type: String,
            required: [true, 'HackerRank ID is required'],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

CodeCrusadeSchema.index({ email: 1 });
CodeCrusadeSchema.index({ rollNumber: 1 });
CodeCrusadeSchema.index({ instituteEmail: 1 });

export default mongoose.models.CodeCrusade || mongoose.model('CodeCrusade', CodeCrusadeSchema);
