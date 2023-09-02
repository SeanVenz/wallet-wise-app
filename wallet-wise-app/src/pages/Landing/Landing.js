import { Link } from 'react-router-dom';

function Landing() {
  return (
    <div>
      <h1>Welcome to our app!</h1>
      <Link to="/login"><button>Login</button></Link>
      <Link to="/signup"><button>Sign Up</button></Link>
    </div>
  );
}

export default Landing;
