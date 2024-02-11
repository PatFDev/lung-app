import React, { useState } from "react";
import axios from "axios";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [classification, setClassification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setClassification("");
      setIsLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedImage(e.dataTransfer.files[0]);
      setClassification("");
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const url = "http://127.0.0.1:5000/predict";
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      const { data } = await axios.post(url, formData, config);

      setClassification(data.classification);
      setHistory((prevHistory) => [
        ...prevHistory,
        {
          image: URL.createObjectURL(selectedImage),
          classification: data.classification,
        },
      ]);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error: Could not fetch the classification.");
    } finally {
      setIsLoading(false);
    }
  };

  const appStyle = {
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#222",
    color: "#fff",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  };

  const containerStyle = {
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    borderRadius: "20px",
    backgroundColor: "#333",
    padding: "40px",
    maxWidth: "800px",
    width: "100%",
  };

  const headingStyle = {
    marginBottom: "20px",
  };

  const dropZoneStyle = {
    border: "2px dashed #007bff",
    padding: "20px",
    borderRadius: "10px",
    color: "#007bff",
    margin: "20px 0",
  };

  const buttonStyle = {
    padding: "10px 20px",
    fontSize: "16px",
    color: "#333",
    backgroundColor: isLoading ? "#ccc" : "#28a745",
    border: "none",
    borderRadius: "5px",
    display: "inline-block",
    marginTop: "20px",
    cursor: isLoading ? "not-allowed" : "pointer",
  };

  return (
    <div style={appStyle}>
      <div style={containerStyle}>
        <h1 style={headingStyle}>LungVision AI</h1>
        <div style={styles.mainContent}>
          <div style={styles.uploadSection}>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={dropZoneStyle}
            >
              <label htmlFor="file-upload" style={styles.customFileUpload}>
                {selectedImage
                  ? selectedImage.name
                  : "Drag an image here or click to choose"}
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
              />
            </div>
            <button
              onClick={handleSubmit}
              style={buttonStyle}
              disabled={isLoading}
            >
              {isLoading ? "Analyzing..." : "Upload and Classify"}
            </button>
            {isLoading && <div style={styles.loader}></div>}
            {selectedImage && !isLoading && (
              <div style={styles.imageContainer}>
                <img
                  src={URL.createObjectURL(selectedImage)}
                  alt="Preview"
                  style={styles.image}
                />
                {classification && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "10px",
                      borderRadius: "5px",
                      display: "inline-block",
                      width: "100%",
                      backgroundColor:
                        classification === "NORMAL" ? "#d4edda" : "#f8d7da", // Green for normal, red for pneumonia
                      color:
                        classification === "NORMAL" ? "#155724" : "#721c24", // Dark green text for normal, dark red text for pneumonia
                      border: `2px solid ${
                        classification === "NORMAL" ? "#28a745" : "#dc3545"
                      }`, // Border color changes based on classification
                    }}
                  >
                    {classification === "NORMAL"
                      ? "No Pneumonia Detected 👍"
                      : "Pneumonia Detected 🤒"}
                  </div>
                )}
              </div>
            )}
          </div>
          <div style={styles.historySection}>
            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  ...styles.historyItem,
                  backgroundColor:
                    item.classification === "NORMAL" ? "#d4edda" : "#f8d7da", // Green for normal, red for pneumonia
                  color:
                    item.classification === "NORMAL" ? "#155724" : "#721c24", // Text color
                  borderColor:
                    item.classification === "NORMAL" ? "#28a745" : "#dc3545", // Border color
                }}
              >
                <img
                  src={item.image}
                  alt={`Preview ${index}`}
                  style={styles.smallImage}
                />
                <p
                  style={{
                    color:
                      item.classification === "NORMAL" ? "#155724" : "#721c24",
                  }}
                >
                  {item.classification}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  mainContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
  },
  uploadSection: {
    flex: 1,
  },
  historySection: {
    width: "300px",
    maxHeight: "600px",
    overflowY: "auto",
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    margin: "5px 0",
    border: "2px solid",
    borderRadius: "5px",
  },
  customFileUpload: {
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    display: "inline-block",
    margin: "10px 0",
  },
  loader: {
    border: "4px solid #f3f3f3",
    borderRadius: "50%",
    borderTop: "4px solid #3498db",
    width: "50px",
    height: "50px",
    animation: "spin 2s linear infinite",
    margin: "10px auto",
  },
  imageContainer: {
    marginTop: "20px",
  },
  image: {
    maxWidth: "100%",
    borderRadius: "5px",
  },
  result: {
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    display: "inline-block",
    width: "100%",
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  smallImage: {
    width: "50px",
    height: "50px",
    marginRight: "10px",
    borderRadius: "5px",
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)" },
    to: { transform: "rotate(360deg)" },
  },
};

export default App;
