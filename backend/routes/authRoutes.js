import express from 'express';
import * as authController from '../controllers/authController.js';
import { validateAuth } from '../utils/validateInput.js';

const router = express.Router();

router.post('/signup', async (req, res, next) => {
  try {
    const { isValid, errors } = validateAuth(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    await authController.signup(req, res);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { isValid, errors } = validateAuth(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
});

export default router;
