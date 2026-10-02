import connectDB from '@/lib/mongodb';
import HackfestTeam from '@/models/HackfestTeam';

const EMAIL_RULE = /^\S+@\S+\.\S+$/;
const MAX_MEMBERS = 3;

const clean = (value) => (typeof value === 'string' ? value.trim() : '');

const collectMessages = (errors) =>
  Object.values(errors)
    .map((error) => {
      if (typeof error.message === 'string') return error.message;
      return (error.errors || []).map((inner) => inner.message).join(', ');
    })
    .filter(Boolean);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { teamLeader, members, projectDescription } = req.body || {};

    const leader = {
      name: clean(teamLeader?.name),
      rollNo: clean(teamLeader?.rollNo),
      email: clean(teamLeader?.email).toLowerCase(),
      phone: clean(teamLeader?.phone),
    };

    if (Object.values(leader).some((value) => !value)) {
      return res
        .status(400)
        .json({ error: 'All team leader fields are required.' });
    }

    if (!EMAIL_RULE.test(leader.email)) {
      return res
        .status(400)
        .json({ error: 'Please enter a valid email address.' });
    }

    const description = clean(projectDescription);
    if (!description) {
      return res
        .status(400)
        .json({ error: 'Project description is required.' });
    }

    const incoming = Array.isArray(members) ? members : [];
    if (incoming.length > MAX_MEMBERS) {
      return res.status(400).json({
        error: `A team can have at most ${MAX_MEMBERS} additional members.`,
      });
    }

    const cleanedMembers = incoming
      .map((member) => ({
        name: clean(member?.name),
        email: clean(member?.email).toLowerCase(),
        phone: clean(member?.phone),
      }))
      .filter((member) => member.name || member.email || member.phone);

    const existing = await HackfestTeam.findOne({
      $or: [
        { 'teamLeader.email': leader.email },
        { 'teamLeader.rollNo': leader.rollNo },
      ],
    });

    if (existing) {
      return res.status(409).json({
        error:
          'A team with this leader email or roll number is already registered.',
      });
    }

    const registration = await HackfestTeam.create({
      teamLeader: leader,
      members: cleanedMembers,
      projectDescription: description,
    });

    return res.status(201).json({
      message: 'Registration successful',
      data: registration,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = collectMessages(error.errors).join(', ');
      return res.status(400).json({ error: messages || 'Validation failed.' });
    }

    if (error.code === 11000) {
      return res.status(409).json({
        error:
          'A team with this leader email or roll number is already registered.',
      });
    }

    console.error('Hackfest registration error:', error);
    return res.status(500).json({
      error: 'Internal server error. Please try again later.',
    });
  }
}
