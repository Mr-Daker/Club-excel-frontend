import connectDB from '@/lib/mongodb';
import CodeCrusade from '@/models/CodeCrusade';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Connect to database
    await connectDB();

    const { name, phone, email, instituteEmail, rollNumber, hostelLocal, groupName, hackId } = req.body;

    // Validate required fields
    if (!name || !phone || !email || !instituteEmail || !rollNumber || !hostelLocal || !groupName || !hackId) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already registered
    const existingUser = await CodeCrusade.findOne({
      $or: [{ email }, { instituteEmail }, { rollNumber }]
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'User already registered with this email, institute email, or roll number'
      });
    }

    // Create new registration
    const newRegistration = await CodeCrusade.create({
      name,
      phone,
      email,
      instituteEmail,
      rollNumber,
      hostelLocal,
      groupName,
      hackId,
    });

    return res.status(201).json({
      message: 'Registration successful',
      data: newRegistration
    });

  } catch (error) {
    console.error('Code Crusade registration error:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }

    return res.status(500).json({
      error: 'Internal server error. Please try again later.'
    });
  }
}
