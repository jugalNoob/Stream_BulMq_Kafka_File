import React, { useState } from 'react';

function Read() {
    const [fileName, setFileName] = useState('');
    const [fileContent, setFileContent] = useState('');
    const [filePath, setFilePath] = useState('');
    const [error, setError] = useState('');

    const handleReadFile = async () => {
        setError(''); // Clear previous errors
        setFileContent(''); // Clear previous content
        setFilePath(''); // Clear previous file path

        try {
            const response = await fetch('http://localhost:9000/read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName }),  // Send the fileName in the request body
            });

            console.log(response)
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to fetch the file content.');
                return;
            }

            const data = await response.json();
            setFileContent(data.content); // Set the content
            setFilePath(data.filePath);   // Set the file path
        } catch (err) {
            console.error('Error fetching file:', err);
            setError('An error occurred while fetching the file.');
        }     if (!fileName) {
            setError('File name is required.');
            return;
        }

   
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Read File</h2>
            <input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ padding: '8px', width: '300px', marginRight: '10px' }}
            />
            <button onClick={handleReadFile} style={{ padding: '8px 15px' }}>
                Read File
            </button>

            {error && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {fileContent && (
                <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>File Content:</h3>
                    <pre>{fileContent}</pre>
                    <h4>File Location:</h4>
                    <p>{filePath}</p>
                </div>
            )}
        </div>
    );
}

export default Read;
