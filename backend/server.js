const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: "https://gym-tracker-ruby-mu.vercel.app",
  })
);

app.use(express.json());

/* MONGODB CONNECTION */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((error) => console.log(error));

/* USER SCHEMA */
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

/* USER MODEL */
const User = mongoose.model("User", userSchema);

/* WORKOUT SCHEMA */
const workoutSchema = new mongoose.Schema({
  userId: String,
  name: String,
  category: String,
  exercise: String,
  sets: Number,
  reps: Number,
});

/* WORKOUT MODEL */
const Workout = mongoose.model("Workout", workoutSchema);

/* AUTH MIDDLEWARE */
const verifyToken = (req, res, next) => {

  const token = req.headers.authorization;

  if (!token) {

    return res.status(401).json({
      message: "Access denied",
    });

  }

  try {

    const verified = jwt.verify(token, "SECRET_KEY");

    req.user = verified;

    next();

  } catch (error) {

    return res.status(401).json({
      message: "Invalid token",
    });

  }

};

/* REGISTER API */
app.post("/api/register", async (req, res) => {

  try {

    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.json({
        message: "User already exists",
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({
      message: "User registered successfully!",
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

});

/* LOGIN API */
app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.json({
        message: "User not found",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.json({
        message: "Invalid credentials",
      });

    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      "SECRET_KEY",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful!",
      token,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

});

/* GET USER WORKOUTS */
app.get("/api/workouts", verifyToken, async (req, res) => {

  try {

    const workouts = await Workout.find({
      userId: req.user.id,
    });

    res.json(workouts);

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

});

/* POST WORKOUT */
app.post("/api/workouts", verifyToken, async (req, res) => {

  try {

    const newWorkout = new Workout({
      userId: req.user.id,
      name: req.body.name,
      category: req.body.category,
      exercise: req.body.exercise,
      sets: req.body.sets,
      reps: req.body.reps,
    });

    await newWorkout.save();

    res.json({
      message: "Workout added successfully!",
      workout: newWorkout,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server error",
    });

  }

});

/* DELETE WORKOUT */
app.delete(
  "/api/workouts/:id",
  verifyToken,
  async (req, res) => {

    try {

      const workout = await Workout.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!workout) {

        return res.status(404).json({
          message: "Workout not found",
        });

      }

      await Workout.findByIdAndDelete(req.params.id);

      res.json({
        message: "Workout deleted successfully!",
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server error",
      });

    }

  }
);

/* UPDATE WORKOUT */
app.put(
  "/api/workouts/:id",
  verifyToken,
  async (req, res) => {

    try {

      const workout = await Workout.findOne({
        _id: req.params.id,
        userId: req.user.id,
      });

      if (!workout) {

        return res.status(404).json({
          message: "Workout not found",
        });

      }

      const updatedWorkout =
        await Workout.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.name,
            category: req.body.category,
            exercise: req.body.exercise,
            sets: req.body.sets,
            reps: req.body.reps,
          },
          { new: true }
        );

      res.json(updatedWorkout);

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: "Server error",
      });

    }

  }
);

/* SERVER */
app.listen(process.env.PORT, () => {
  console.log(
    `Server running on port ${process.env.PORT}`
  );
});