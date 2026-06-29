import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '@config/env';

interface JwtPayload {
  sub: number;
  role: 'Admin' | 'User';
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ error: 'Missing or invalid Authorization header' });
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, env.jwtSecret);

    // Narrow the union type: must be an object, not a string
    if (typeof decoded !== 'object' || decoded === null) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const payload = decoded as unknown as JwtPayload;

    // Runtime guards to ensure payload matches our expected shape
    if (
      typeof payload.sub !== 'number' ||
      (payload.role !== 'Admin' && payload.role !== 'User')
    ) {
      return res.status(401).json({ error: 'Invalid token payload' });
    }

    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  if (req.user.role !== 'Admin') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
};