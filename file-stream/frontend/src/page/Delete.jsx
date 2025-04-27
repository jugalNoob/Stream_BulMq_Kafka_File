import React, { useState } from "react";

function DeleteFile() {
    const [fileName, setFileName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleDeleteFile = async () => {
        // Clear previous messages and errors
        setError("");
        setMessage("");

        if (!fileName.trim()) {
            setError("File name is required.");
            return;
        }

        try {
            const response = await fetch("http://localhost:9000/delete-file", {
                method: "DELETE", // Match the backend's DELETE method
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ fileName }), // Send the file name in the request body
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle error returned from the backend
                setError(data.error || "An error occurred while deleting the file.");
                return;
            }

            // If successful, display the message
            setMessage(data.message || `File '${fileName}' deleted successfully!`);
        } catch (err) {
            console.error("Error deleting file:", err);
            setError("An unexpected error occurred.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Delete Your File</h2>
            <input
                type="text"
                placeholder="Enter file name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                style={{ padding: "8px", width: "300px", marginRight: "10px" }}
            />
            <button onClick={handleDeleteFile} style={{ padding: "8px 15px" }}>
                Delete File
            </button>

            {error && (
                <div style={{ marginTop: "20px", color: "red" }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {message && (
                <div style={{ marginTop: "20px", color: "green" }}>
                    <strong>Success:</strong> {message}
                </div>
            )}
        </div>
    );
}

export default DeleteFile;
