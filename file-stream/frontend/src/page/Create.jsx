import React, { useState } from 'react';

function Create() {
  const [fileName, setFileName] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setMessage('');

    if (!fileName.trim() || !content.trim()) {
      setError('File name and content are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/create-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName, content }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
        setFileName('');
        setContent('');
      } else {
        setError(data.error || 'Something went wrong!');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Create File</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>File Name:</label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
            style={{ marginLeft: '10px', padding: '5px', width: '300px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ marginLeft: '10px', padding: '5px', width: '300px', height: '100px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 15px' }}>
          Create File
        </button>
      </form>
      {error && (
        <p style={{ color: 'red', marginTop: '20px' }}>
          <strong>Error:</strong> {error}
        </p>
      )}
      {message && (
        <p style={{ color: 'green', marginTop: '20px' }}>
          <strong>Success:</strong> {message}
        </p>
      )}
    </div>
  );
}

export default Create;
