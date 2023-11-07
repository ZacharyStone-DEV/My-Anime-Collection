import User from "../models/User.js";
import Anime from "../models/Anime.js";
import Playlist from "../models/Playlists.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
import { DEMO_USER } from "../utils/constants.js";
import { SEED_ANIMES, DEFAULT_PLAYLISTS } from "../utils/constants.js";
import { generateRandomNumber } from "../utils/misc.js";

// REST routes are defined in authRoutes.js
const login = async (req, res) => {
  const { email, password } = req.body;

  const errorMessage = "Please provide all values";

  if (!email || !password) {
    throw new BadRequestError(errorMessage);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token });
};

const updateUser = async (req, res) => {
  const { email, name, theme } = req.body;

  const errorMessage = "Please provide all values";

  if (!email || !name || !theme) {
    throw new BadRequestError(errorMessage);
  }

  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.theme = theme;

  await user.save();

  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token });
};

const register = async (req, res) => {
  const { isDemo } = req.body;
  const { name, email, password } = isDemo ? DEMO_USER : req.body;
  const { theme } = req.body;

  const errorMessage = "Please provide all values";

  if (!isDemo && (!name || !email || !password)) {
    throw new BadRequestError(errorMessage);
  }

  let userEmail = email;

  const userAlreadyExists = await User.findOne({ email });

  if (userAlreadyExists) {
    if (isDemo) {
      userEmail = `DemoUser${generateRandomNumber()}${generateRandomNumber()}${generateRandomNumber()}@demo.com`;
    } else {
      throw new BadRequestError("Email already in use");
    }
  }

  // create user
  const user = await User.create({
    name,
    email: userEmail,
    password,
    isDemo,
    theme,
  });

  // create base playlists
  for (const playlist of DEFAULT_PLAYLISTS) {
    playlist.userID = user._id;
    playlist.isDemoUserPlaylist = isDemo;
  }

  DEFAULT_PLAYLISTS.forEach(async (playlist) => {
    await Playlist.create(playlist);
  });

  if (isDemo) {
    const animePromises = SEED_ANIMES.map(async (animeData) => {
      try {
        await Anime.create({
          createdBy: user._id,
          ...animeData,
        });
      } catch (error) {
        console.error(`Error creating anime: ${error.message}`);
      }
    });

    await Promise.all(animePromises);
  }

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      email: user.email,
      isDemo: user.isDemo,
      name: user.name,
      theme: user.theme,
    },
    token,
  });
};

const deleteUser = async (req, res) => {
  // Delete user
  const user = await User.findOne({ _id: req.user.userId });
  await user.remove();
  res.status(StatusCodes.OK).json({ message: "User deleted" });

  // Delete all associated animes
  const animes = await Anime.find({ createdBy: req.user.userId });

  const animePromises = animes.map(async (anime) => {
    try {
      await anime.remove();
    } catch (error) {
      console.error(`Error deleting anime: ${error.message}`);
    }
  });

  await Promise.all(animePromises);

  // delete all associated playlists
  const playlists = await Playlist.find({ userID: req.user.userId });

  const playlistPromises = playlists.map(async (playlist) => {
    try {
      await playlist.remove();
    } catch (error) {
      console.error(`Error deleting playlist: ${error.message}`);
    }
  });

  await Promise.all(playlistPromises);
};

export { register, login, updateUser, deleteUser };
