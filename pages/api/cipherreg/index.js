import connectDB from '@/lib/mongodb';
import CipherChase from '@/models/CipherChase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { name, phone, email, rollNo, hostelLocal } = req.body;

    if (!name || !phone || !email || !rollNo || !hostelLocal) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await CipherChase.findOne({
      $or: [{ email }, { rollNo }]
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already registered with this email or roll number'
      });
    }
    const newRegistration = await CipherChase.create({
      name,
      phone,
      email,
      rollNo,
      hostelLocal,
    });

    return res.status(201).json({
      message: 'Registration successful',
      data: newRegistration
    });

  } catch (error) {
    console.error('Cipher Chase registration error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    return res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
}
