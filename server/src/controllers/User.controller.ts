import User from '../models/User.model';
import { asyncHandler } from '../helpers/AsyncHelper';
import { ServerError, SuccessResponse } from '../helpers/ResponseHelpers';
import bcrypt from 'bcryptjs';
import signJWT from '../utils/signJWT';

const UserController = {
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return ServerError(res, 'Email or username already registered');
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

  authenticate: asyncHandler(async (req, res) => {
    const { address, username } = req.body;
    let user = await User.findOne({ address });
    if (!user && username) {
      let userWithUsername = await User.findOne({ username });
      if (userWithUsername) {
        return ServerError(res, 'Username already taken', 400);
      }
      user = await User.create({
        username,
        address,
      });
    } else if (!user) {
      return SuccessResponse(res, { data: user }, 'No username set', 200);
    }

    const jwt = signJWT(user.toObject());

    return SuccessResponse(
      res,
      { data: user, token: jwt },
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
      200
    );
  }),

  getLoggedInUser: asyncHandler(async (req, res) => {
    const user = req.user;
    if (!user) {
      return ServerError(res, 'User not found', 404);
    }
    const { password, ...strippedUser } = user;

    return SuccessResponse(res, strippedUser, 'User retrieved successful', 200);
  }),

  getUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return ServerError(res, 'User not found', 404);
    }
    const { password, ...strippedUser } = user.toObject();

    return SuccessResponse(res, strippedUser, 'User retrieved successful', 200);
  }),
};

export default UserController;
