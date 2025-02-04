/* eslint-disable react/prop-types */
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SubjectsContext from "./SubjectContext.js";
import AuthContext from "./AuthContext.js";

export const SubjectsProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [subjects, setSubjects] = useState([]);
  const [editSubject, setEditSubject] = useState(null);
  const [open, setOpen] = useState(false);

  const [newSubject, setNewSubject] = useState({
    subject: "",
    totalClasses: 0,
    attendedClasses: 0,
  });

  const token = localStorage.getItem("authToken");

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = () => {
      axios
        .get("https://attendance-tracker-backend-ssna.onrender.com/attendance", {
          headers: { Authorization: `Bearer ${token}` }, // Send the token
        })
        .then((res) => setSubjects(res.data))
        .catch((err) => console.error("Error fetching subjects:", err.message));
    };

    fetchSubjects();
  }, [token]);

  const handleAddOrEditSubject = async () => {
    try {
      if (!user) {
        toast.error("Please log in");
        return;
      }

      if (editSubject) {
        // Edit existing subject
        const { data } = await axios.put(
          `https://attendance-tracker-backend-ssna.onrender.com/attendance/${editSubject._id}`,
          newSubject,
          {
            headers: { Authorization: `Bearer ${token}` }, // Send the token
          }
        );

        if (data.success) {
          setSubjects((prev) =>
            prev.map((subj) =>
              subj._id === editSubject._id ? data.updatedSubject : subj
            )
          );
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      } else {
        // Add new subject
        const { data } = await axios.post(
          "https://attendance-tracker-backend-ssna.onrender.com/attendance",
          newSubject,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data.success) {
          setSubjects((prev) => [...prev, data.newAttendance]);
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      }

      setNewSubject({ subject: "", totalClasses: 0, attendedClasses: 0 });
      if (setOpen) setOpen(false); // Close dialog if mobile view
    } catch (err) {
      console.error("Error adding or editing subject:", err.message);
      toast.error("Error");
    }
  };

  // Increment attendance
  const handleIncrementAttendance = async (id, type) => {
    if (!user) {
      toast.error("Please log in to update attendance.");
      return;
    }
    try {
      const updatedSubjects = subjects.map((subj) => {
        if (subj._id === id) {
          return { ...subj, [type]: subj[type] + 1 };
        }
        return subj;
      });

      setSubjects(updatedSubjects);

      await axios.put(
        `https://attendance-tracker-backend-ssna.onrender.com/attendance/${id}`,
        {
          [type]: updatedSubjects.find((subj) => subj._id === id)[type],
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Send the token
        }
      );
    } catch (err) {
      console.error("Error updating attendance:", err.message);
    }
  };

  // Delete subject
  const deleteSubject = async (id) => {
    try {
      const { data } = await axios.delete(
        `https://attendance-tracker-backend-ssna.onrender.com/attendance/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // Send the token
        }
      );
      setSubjects((prev) => prev.filter((subj) => subj._id !== id));
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error deleting subject");
      console.error(err.message);
    }
  };

  return (
    <SubjectsContext.Provider
      value={{
        subjects,
        handleIncrementAttendance,
        deleteSubject,
        handleAddOrEditSubject,
        newSubject,
        setNewSubject,
        editSubject,
        setEditSubject,
        open,
        setOpen,
      }}
    >
      {children}
    </SubjectsContext.Provider>
  );
};
