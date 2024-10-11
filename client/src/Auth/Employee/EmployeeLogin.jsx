import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../OtherComponents/LoadingSpinner";

const EmployeeLogin = ({ onLogin }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const [employeeUsername, setEmployeeUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${apiUrl}/api/employeeLogin`,
        { employeeUsername, password },
        { withCredentials: true }
      );

      const { user } = response.data;
      onLogin(user); // Update user state in App component
      navigate("/dashboard"); // Redirect user to the specified URL
    } catch (error) {
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", error.response.data);

        if (error.response.status === 401) {
          setError("Invalid employee ID or password");
        } else {
          setError("An error occurred. Please try again.");
        }
      } else if (error.request) {
        console.error("Error request:", error.request);
        setError("Network error. Please try again later.");
      } else {
        console.error("Error message:", error.message);
        setError("An error occurred. Please try again.");
      }
      console.error("Error config:", error.config);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <LoadingSpinner isLoading={loading} />
      <h2>Employee Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={submit} disabled={loading}>
        <label htmlFor="employeeUsername">
          Username:
          <input
            type="text"
            name="employeeUsername"
            id="employeeUsername"
            required
            autoFocus
            value={employeeUsername}
            autoComplete="off"
            placeholder="Input your Username"
            onChange={(e) => setEmployeeUsername(e.target.value)}
          />
        </label>
        <br />
        <label htmlFor="password">
          Password:
          <input
            type="password"
            name="password"
            id="password"
            required
            value={password}
            autoComplete="off"
            placeholder="Input your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default EmployeeLogin;
