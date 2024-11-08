import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';

require('dotenv').config({ path: require('find-config')('.env') });

// Initialize Firebase Admin (you'll need to set up Firebase project)
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    username: string;
  };
}

export async function authenticateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const idToken = req.headers.authorization?.split('Bearer ')[1];

  if (!idToken) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);

    // Attach user info to request
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email || '',
      username: decodedToken.name || ''
    };

    next();
  } catch (error) {
    console.error('Authentication Error:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export async function registerUser(req: Request, res: Response) {
  try {
    const { email, password, username } = req.body;

    // Create user in Firebase
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username
    });

    // // Optionally store additional user info in your database
    // await UserModel.create({
    //   firebaseId: userRecord.uid,
    //   username,
    //   email
    // });

    res.status(201).json({
      message: 'User registered successfully',
      userId: userRecord.uid
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
}