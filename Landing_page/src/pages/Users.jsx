import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../constant/server"; 

export default function Users() {
  const [users, setUsers] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        fetchUsers();
      } else {
        setIsLoggedIn(false);
      }
    });

    return () => unsubscribe(); // Cleanup listener
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id, // Include document ID if needed
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Function to handle sending the POST request
  const handleSendEmails = async () => {
    const usersToSend = users.map((user) => ({
      fullName: user.fullName,
      email: user.email,
    }));

    const payload = { users: usersToSend };
    console.log(payload)
    try {
      const response = await fetch("http://127.0.0.1:3000/send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message); // Success message
      } else {
        alert(`Error: ${data.error}`); // Error message
      }
    } catch (error) {
      console.error("Error sending emails:", error);
      alert("There was an error sending the emails.");
    }
  };

  if (!isLoggedIn) {
    return <div>Please log in to view user data.</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <ul className="space-y-4">
        {users.map((user) => (
          <li key={user.id} className="p-4 bg-gray-100 rounded-lg shadow">
            <p><strong>Full Name:</strong> {user.fullName || "N/A"}</p>
            <p><strong>Email:</strong> {user.email || "N/A"}</p>
          </li>
        ))}
      </ul>
      <button
        onClick={handleSendEmails}
        className="mt-4 w-full py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition"
      >
        Send Updates to All Users
      </button>
    </div>
  );
}
