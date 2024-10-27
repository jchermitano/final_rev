import { useState, useEffect } from 'react';
import './Log.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Log() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/getUsersFromDB2')
      .then(response => {
        const sortedUsers = response.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setUsers(sortedUsers);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  }, []);

  function secondsToHms(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  return (
    <div className="log-container">
      <h2 className="log-title">Logs</h2>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Student Number</th>
              <th>Login Date</th>
              <th>Remaining Time</th>
              <th>Timestamp</th>
              <th>Logout Time</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.email}</td>
                <td>{user.student_number}</td>
                <td>{user.login_date.substring(0, 10)}</td>
                <td>{secondsToHms(parseInt(user.remaining_time))}</td>
                <td>{user.timestamp.substring(0, 19)}</td>
                <td>{user.logout_time.substring(0, 19)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Log;
