import { useEffect, useState } from "react";
import "./GymTracker.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function GymTracker() {

  const [workouts, setWorkouts] = useState([]);

  const [name, setName] = useState("");
  const [exercise, setExercise] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");

  const [category, setCategory] = useState("Push");

  const [filterCategory, setFilterCategory] = useState("All");

  // EDIT STATES
  const [editingId, setEditingId] = useState(null);

  const [editName, setEditName] = useState("");
  const [editExercise, setEditExercise] = useState("");
  const [editSets, setEditSets] = useState("");
  const [editReps, setEditReps] = useState("");

  // BMI STATES
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState("");

  // AUTH STATES
const [isLogin, setIsLogin] = useState(true);

const [username, setUsername] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

const [isAuthenticated, setIsAuthenticated] = useState(false);

// CHECK TOKEN
useEffect(() => {

  const token = localStorage.getItem("token");

  if (token) {
    setIsAuthenticated(true);
  }

}, []);

  // GET API
  useEffect(() => {
    fetch("https://gymtracker-backend-ety8.onrender.com/api/workouts")
      .then((response) => response.json())
      .then((data) => setWorkouts(data))
      .catch((error) => console.log(error));
  }, []);

  // POST API
  const addWorkout = async () => {

    const newWorkout = {
  name,
  category,
  exercise,
  sets,
  reps,
};

    const response = await fetch("https://gymtracker-backend-ety8.onrender.com/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newWorkout),
    });

    const data = await response.json();

    setWorkouts([...workouts, data.workout]);

    toast.success("Workout added successfully!");

    setName("");
    setExercise("");
    setSets("");
    setReps("");
  };

  // DELETE API
const deleteWorkout = async (id) => {

  const confirmDelete = window.confirm(
    "Are you sure you want to delete this workout?"
  );

  if (!confirmDelete) {
    return;
  }

  try {

    await fetch(`https://gymtracker-backend-ety8.onrender.com/api/workouts/${id}`, {
      method: "DELETE",
    });

    setWorkouts(
       workouts.filter((workout) => workout._id !== id)
    );

    toast.error("Workout deleted!");

  } catch (error) {

    console.log(error);

  }

};

  // START EDITING
  const startEditing = (workout) => {

    setEditingId(workout._id);

    setEditName(workout.name);
    setEditExercise(workout.exercise);
    setEditSets(workout.sets);
    setEditReps(workout.reps);

  };

  // UPDATE API
  const updateWorkout = async (id) => {

    try {

      const updatedWorkout = {
        name: editName,
        category: category,
        exercise: editExercise,
        sets: editSets,
        reps: editReps,
      };

      const response = await fetch(
        `https://gymtracker-backend-ety8.onrender.com/api/workouts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedWorkout),
        }
      );

      const data = await response.json();

      setWorkouts(
  workouts.map((workout) =>
    workout._id === id ? data : workout
  )
);

      setEditingId(null);

      toast.info("Workout updated!");

    } catch (error) {

      console.log(error);

    }

  };

  // BMI CALCULATOR
const calculateBMI = () => {

  if (!height || !weight) {

    toast.error("Please enter height and weight");
    return;

  }

  const heightInMeters = height / 100;

  const bmiValue = (
    weight / (heightInMeters * heightInMeters)
  ).toFixed(1);

  setBmi(bmiValue);

  if (bmiValue < 18.5) {

    setBmiStatus("Underweight");

  } else if (bmiValue >= 18.5 && bmiValue < 25) {

    setBmiStatus("Normal Weight");

  } else if (bmiValue >= 25 && bmiValue < 30) {

    setBmiStatus("Overweight");

  } else {

    setBmiStatus("Obese");

  }

  toast.success("BMI Calculated!");

};

// DASHBOARD STATS

const totalWorkouts = workouts.length;

const totalCategories = new Set(
  workouts.map((workout) => workout.category)
).size;

const totalExercises = workouts.length;

const averageSets =
  workouts.length > 0
    ? (
        workouts.reduce(
          (total, workout) => total + Number(workout.sets),
          0
        ) / workouts.length
      ).toFixed(1)
    : 0;
// REGISTER USER
const registerUser = async () => {

  try {

    const response = await fetch(
      "https://gymtracker-backend-ety8.onrender.com/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    toast.success(data.message);

    setUsername("");
    setEmail("");
    setPassword("");

  } catch (error) {

    console.log(error);

  }

};

// LOGIN USER
const loginUser = async () => {

  try {

    const response = await fetch(
      "https://gymtracker-backend-ety8.onrender.com/api/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (data.token) {

      localStorage.setItem("token", data.token);

      setIsAuthenticated(true);

      toast.success("Login successful!");

    } else {

      toast.error(data.message);

    }

  } catch (error) {

    console.log(error);

  }

};

// LOGOUT USER
const logoutUser = () => {

  localStorage.removeItem("token");

  setIsAuthenticated(false);

  toast.info("Logged out!");

};

  return (
    <div className="app">


      {!isAuthenticated ? (

  <div className="auth-container">

    <div className="auth-box">

      <h2>
        {isLogin ? "Login" : "Register"}
      </h2>

      {!isLogin && (

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

      )}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isLogin ? (

        <button onClick={loginUser}>
          Login
        </button>

      ) : (

        
        <button onClick={registerUser}>
          Register
        </button>

      )}

      <p
        className="auth-switch"
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin
          ? "No account? Register"
          : "Already have an account? Login"}
      </p>

    </div>

  </div>

) : (

  <>

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">GYMTRACKER</h1>

        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#workouts">Workouts</a></li>
          <li><a href="#bmi">BMI</a></li>
          <li><a href="#goals">Goals</a></li>
          <li><a href="#contact">Contact</a></li>

          <button
  className="logout-btn"
  onClick={logoutUser}
>
  Logout
</button>
        </ul>
      </nav>

      {/* HERO SECTION */}
      <section className="hero" id="home">

        <h1>GYM WORKOUT TRACKER</h1>

        <p>
          Track your fitness journey and daily workout progress
        </p>

        <button className="hero-btn">
          Start Training
        </button>

      </section>

      {/* DASHBOARD SECTION */}

<section className="dashboard-section">

  <h2>Fitness Dashboard</h2>

  <div className="dashboard-grid">

    <div className="dashboard-card">
      <h3>{totalWorkouts}</h3>
      <p>Total Workouts</p>
    </div>

    <div className="dashboard-card">
      <h3>{totalCategories}</h3>
      <p>Total Categories</p>
    </div>

    <div className="dashboard-card">
      <h3>{totalExercises}</h3>
      <p>Total Exercises</p>
    </div>

    <div className="dashboard-card">
      <h3>{averageSets}</h3>
      <p>Average Sets</p>
    </div>

  </div>

</section>

      {/* ADD WORKOUT FORM */}
      <section className="workout-section">

        <h2>Add Workout</h2>

        <div className="bmi-box">

          <input
            type="text"
            placeholder="Workout Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Exercise"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />

          <select
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>

  <option value="Push">Push</option>
  <option value="Pull">Pull</option>
  <option value="Legs">Legs</option>
  <option value="Cardio">Cardio</option>
  <option value="Arms">Arms</option>

</select>

          <input
            type="number"
            placeholder="Sets"
            value={sets}
            onChange={(e) => setSets(e.target.value)}
          />

          <input
            type="number"
            placeholder="Reps"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
          />

          <button onClick={addWorkout}>
            Add Workout
          </button>

        </div>
      </section>

      {/* WORKOUT SECTION */}
      <section className="workout-section" id="workouts">

        <h2>Workout Routines</h2>

        <div className="filter-box">

  <select
    value={filterCategory}
    onChange={(e) => setFilterCategory(e.target.value)}
  >

    <option value="All">All Categories</option>
    <option value="Push">Push</option>
    <option value="Pull">Pull</option>
    <option value="Legs">Legs</option>
    <option value="Cardio">Cardio</option>
    <option value="Arms">Arms</option>

  </select>

</div>

        <div className="workout-cards">

          {workouts
    .filter((workout) => {

      if (filterCategory === "All") {
        return true;
      }

      return workout.category === filterCategory;

    })
    .map((workout) => (
            <div className="card" key={workout._id}>

              <div className="emoji">🏋️</div>

              {editingId === workout._id ? (

                <>

                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />

                  <input
                    type="text"
                    value={editExercise}
                    onChange={(e) => setEditExercise(e.target.value)}
                  />

                  <input
                    type="number"
                    value={editSets}
                    onChange={(e) => setEditSets(e.target.value)}
                  />

                  <input
                    type="number"
                    value={editReps}
                    onChange={(e) => setEditReps(e.target.value)}
                  />

                  <button
                  className="save-btn"
                  onClick={() => updateWorkout(workout._id)}
                  >
                  Save
                  </button>

                </>

              ) : (

                <>

                  <h3>{workout.name}</h3>

                  <p>
                     <strong>Category:</strong> {workout.category}
                  </p>

                  <p>
                    <strong>Exercise:</strong> {workout.exercise}
                  </p>

                  <p>
                    <strong>Sets:</strong> {workout.sets}
                  </p>

                  <p>
                    <strong>Reps:</strong> {workout.reps}
                  </p>

                  <button
                    className="edit-btn"
                    onClick={() => startEditing(workout)}
                  >
                  Edit
                  </button>

                  <button
                  className="delete-btn"
                  onClick={() => deleteWorkout(workout._id)}
                  >
                  Delete
                 </button>

                </>

              )}

            </div>
          ))}

        </div>
      </section>

      {/* BMI SECTION */}
      <section className="bmi-section" id="bmi">

        <h2>BMI Calculator</h2>

        <div className="bmi-box">

        <input
        type="number"
        placeholder="Enter height in cm"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
        />

        <input
        type="number"
        placeholder="Enter weight in kg"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        />

        <button onClick={calculateBMI}>
        Calculate BMI
        </button>

        {bmi && (

        <div className="bmi-result">

        <h3>Your BMI: {bmi}</h3>

        <p>Status: {bmiStatus}</p>

       </div>

)}

        </div>
      </section>

      {/* GOALS SECTION */}
      <section className="goals-section" id="goals">

        <h2>Fitness Goals</h2>

        <div className="goals-grid">

          <div className="goal-card">
            <h3>Lose Weight</h3>
            <p>Burn fat and improve endurance.</p>
          </div>

          <div className="goal-card">
            <h3>Build Muscle</h3>
            <p>Increase strength and muscle mass.</p>
          </div>

          <div className="goal-card">
            <h3>Stay Consistent</h3>
            <p>Maintain healthy workout habits.</p>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer" id="contact">
        <p>© 2026 GymTracker | Designed for Fitness Enthusiasts</p>
      </footer>

      <ToastContainer />
      
            </>

    )}

      </div>

  );
}

export default GymTracker;