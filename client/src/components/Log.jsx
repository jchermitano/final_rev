import { useState, useEffect } from 'react';
import './Log.css';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function Log() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:4000/getUsersFromDB2')
      .then(response => {
        console.log(response.data);
        setUsers(response.data);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
      });
  }, []);
  
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
                <td>{user.login_date.substring(0, 10)}</td> {/* Extract date from the login_date string */}
                <td>{user.remaining_time}</td>
                <td>{user.timestamp.substring(0, 19)}</td> {/* Shows full date and time in one line */}
                <td>{user.logout_time.substring(0, 19)}</td> {/* Shows full date and time in one line */}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Log;