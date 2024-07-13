import User from '../models/User.model';
import { asyncHandler } from '../helpers/AsyncHelper';
import { ServerError, SuccessResponse } from '../helpers/ResponseHelpers';
import bcrypt from 'bcryptjs';
import signJWT from '../utils/signJWT';

const AuthController = {
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return ServerError(res, 'Email already registered');
    }

    const newUser = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password),
    });

    const jwt = signJWT(newUser.toObject());

    return SuccessResponse(
      res,
      { data: newUser, token: jwt },
      'Registration successful',
      201
    );
  }),

  login: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return ServerError(res, 'Invalid credentials', 400);
    }
    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return ServerError(res, 'Invalid credentials', 400);
    }

    const jwt = signJWT(user.toObject());

    return SuccessResponse(
      res,
      { data: user, token: jwt },
      'Registration successful',
      201
    );
  }),
};

export default AuthController;
