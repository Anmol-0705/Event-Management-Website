const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = (roles = []) => {
  if (typeof roles === 'string') roles = [roles];
  return async (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      req.user = await User.findById(payload.id).select('-passwordHash');
      if (!req.user) return res.status(401).json({ message: 'Invalid token user' });
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      next();
    } catch (err) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;
