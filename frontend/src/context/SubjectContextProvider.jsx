/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SubjectsContext from "./SubjectContext.js";

export const SubjectsProvider = ({ children }) => {
  const [subjects, setSubjects] = useState([]);

  // Fetch subjects on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/attendance")
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error("Error fetching subjects:", err.message));
  }, []);

  // Add new subject
  const addSubject = async (subject) => {
    try {
      const { data } = await axios.post("http://localhost:5000/attendance", {
        subject,
        attendedClasses: 0,
        totalClasses: 0,
      });
      setSubjects((prev) => [...prev, data.newSubject]);
      toast.success("Subject added successfully!");
    } catch (error) {
      toast.error("Error adding subject");
      console.error(error.message);
    }
  };

  // Edit subject
  const updateSubject = async (id, subject) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/attendance/${id}`,
        { subject }
      );
      setSubjects((prev) =>
        prev.map((subj) => (subj._id === id ? data.updatedSubject : subj))
      );
      toast.success("Subject updated successfully!");
    } catch (error) {
      toast.error("Error updating subject");
      console.error(error.message);
    }
  };

  // Increment attendance
  const handleIncrementAttendance = async (id, type) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/attendance/${id}`,
        {
          [type]: 1,
        }
      );
      setSubjects((prev) =>
        prev.map((subj) => (subj._id === id ? data : subj))
      );
    } catch (err) {
      console.error("Error updating attendance:", err.message);
    }
  };

  // Delete subject
  const deleteSubject = async (id) => {
    try {
      const { data } = await axios.delete(
        `http://localhost:5000/attendance/${id}`
      );
      setSubjects((prev) => prev.filter((subj) => subj._id !== id));
      toast.success(data.message);
    } catch (err) {
      toast.error("Error deleting subject");
      console.error(err.message);
    }
  };

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        addSubject,
        updateSubject,
        handleIncrementAttendance,
        deleteSubject,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
};

export default SubjectsContext;
