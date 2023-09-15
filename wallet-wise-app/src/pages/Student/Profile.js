import { auth } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";


const StudentProfile = () => {

  const navigate = useNavigate();

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div>
      <button onClick={handleLogOut}>Log Out</button>
    </div>
  );
};

export default StudentProfile;
