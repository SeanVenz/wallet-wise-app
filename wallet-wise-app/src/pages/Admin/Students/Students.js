import React, { useEffect, useState } from "react";
import {
  approveStudent,
  deleteDocRef,
  getAllUnverifiedStudents,
} from "utils/utils";
import { sendEmail } from "utils/email";
import "./Students.scss";
import { auth } from "utils/firebase";
import { useNavigate } from "react-router-dom";

function Students() {
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const navigate = useNavigate();
  const approvalTemplate = "template_85u4049";
  const rejectionTemplate = "template_31g6itq";

  useEffect(() => {
    const getAllStudents = async () => {
      const students = await getAllUnverifiedStudents();
      setUnverifiedStudents(students);
    };
    getAllStudents();
  }, []);

  const handleApprovalAndEmail = (student) => {
    sendEmail(student, approvalTemplate);

    approveStudent(student.id);

    setUnverifiedStudents((prevStudents) =>
      prevStudents.filter((v) => v.id !== student.id)
    );
  };

  const handleRejectionEmail = (student) => {
    sendEmail(student, rejectionTemplate);
    deleteDocRef(student);
    setUnverifiedStudents((prevStudents) =>
      prevStudents.filter((v) => v.id !== student.id)
    );
  };

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="admin-student">
      <div className="header">
        <h1>Unverified Students</h1>
        <button onClick={handleLogOut}>Logout</button>
      </div>
      {unverifiedStudents.length > 0 ? (
        <div className="card-container">
          {unverifiedStudents.map((student, index) => (
            <div className="card" key={student.id}>
              <div className="card-header">
                <h2>{student.displayName}</h2>
              </div>
              <div className="card-body">
                <p>ID Number: {student.idNumber}</p>
                <p>Phone Number: {student.phoneNumber}</p>
                <div className="decision-buttons">
                  <button onClick={() => handleRejectionEmail(student)}>
                    Reject
                  </button>
                  <button onClick={() => handleApprovalAndEmail(student)}>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>No Students Yet</h1>
      )}
    </div>
  );
}

export default Students;
