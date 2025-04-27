import axios from "axios"; // Uncommented for use
import React, { useEffect, useState } from "react";

function File() {
  const [file, setFile] = useState(null);

  // Fetch storage information from the backend
  const fetchFilesystem = async () => {
    try {
      const response = await axios.get("http://localhost:9000/storage",{

        
        headers: {
          "Content-Type": "application/json",
    
        },
      
      }); // Adjust the URL if needed
      console.log(response.data)
      setFile(response.data);
    } catch (error) {
      console.error("Error fetching filesystem data:", error);
    }
  };

  useEffect(() => {
    fetchFilesystem();
  }, []);

  return (
    <div>
      <h1>File</h1>
      {file ? (
        <ul>
          {file.map((disk, index) => (
            <li key={index}>
              <strong>Mount:</strong> {disk.mount} <br />
              <strong>Total:</strong> {disk.total} <br />
              <strong>Used:</strong> {disk.used} <br />
              <strong>Free:</strong> {disk.free} <br />
              <strong>Type:</strong> {disk.type} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading storage information...</p>
      )}
    </div>
  );
}

export default File;
