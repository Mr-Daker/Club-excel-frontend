import mongoose from 'mongoose';

const EMAIL_RULE = /^\S+@\S+\.\S+$/;

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
      validate: {
        validator: (value) => !value || EMAIL_RULE.test(value),
        message: 'Please enter a valid email address',
      },
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: false }
);

const leaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Team leader name is required'],
      trim: true,
    },
    rollNo: {
      type: String,
      required: [true, 'Team leader roll number is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Team leader email is required'],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => !value || EMAIL_RULE.test(value),
        message: 'Please enter a valid email address',
      },
    },
    phone: {
      type: String,
      required: [true, 'Team leader phone number is required'],
      trim: true,
    },
  },
  { _id: false }
);

const HacktoberfestTeamSchema = new mongoose.Schema(
  {
    teamLeader: {
      type: leaderSchema,
      required: [true, 'Team leader details are required'],
    },
    members: {
      type: [memberSchema],
      default: [],
      validate: {
        validator: (value) => value.length <= 3,
        message: 'A team can have at most 3 additional members',
      },
    },
    projectDescription: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
  },
  { timestamps: true }
);

HacktoberfestTeamSchema.index({ 'teamLeader.email': 1 }, { unique: true });
HacktoberfestTeamSchema.index({ 'teamLeader.rollNo': 1 }, { unique: true });

export default mongoose.models.HacktoberfestTeam ||
  mongoose.model('HacktoberfestTeam', HacktoberfestTeamSchema);
