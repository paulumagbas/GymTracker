import "./GymTracker.css";

function GymTracker() {
  return (
    <div className="app">

      {/* NAVBAR */}
      <nav className="navbar">
        <h1 className="logo">GYMTRACKER</h1>

        <ul className="nav-links">
          <li><a href="#home">Home</a></li>
          <li><a href="#workouts">Workouts</a></li>
          <li><a href="#bmi">BMI</a></li>
          <li><a href="#goals">Goals</a></li>
          <li><a href="#contact">Contact</a></li>
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

      {/* WORKOUT SECTION */}
      <section className="workout-section" id="workouts">

        <h2>Workout Routines</h2>

        <div className="workout-cards">

          <div className="card">
            <div className="emoji">🏋️</div>

            <h3>Push Day</h3>

            <p><strong>Exercise:</strong> Bench Press</p>
            <p><strong>Sets:</strong> 4</p>
            <p><strong>Reps:</strong> 10</p>
          </div>

          <div className="card">
            <div className="emoji">💪</div>

            <h3>Pull Day</h3>

            <p><strong>Exercise:</strong> Pull Ups</p>
            <p><strong>Sets:</strong> 3</p>
            <p><strong>Reps:</strong> 12</p>
          </div>

          <div className="card">
            <div className="emoji">🔥</div>

            <h3>Leg Day</h3>

            <p><strong>Exercise:</strong> Squats</p>
            <p><strong>Sets:</strong> 5</p>
            <p><strong>Reps:</strong> 8</p>
          </div>

        </div>
      </section>

      {/* BMI SECTION */}
      <section className="bmi-section" id="bmi">

        <h2>BMI Calculator</h2>

        <div className="bmi-box">

          <input
            type="number"
            placeholder="Enter height in cm"
          />

          <input
            type="number"
            placeholder="Enter weight in kg"
          />

          <button>
            Calculate BMI
          </button>

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

    </div>
  );
}

export default GymTracker;