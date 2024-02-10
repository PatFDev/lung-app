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

  return (
    <div style={styles.app}>
      <div style={styles.container}>
        <h1 style={styles.heading}>Image Classifier</h1>
        <div style={styles.mainContent}>
          <div style={styles.uploadSection}>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              style={styles.dropZone}
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
              style={styles.button}
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
                  <div style={styles.result(classification)}>
                    {classification === "NORMAL"
                      ? "No Pneumonia Detected"
                      : "Pneumonia Detected"}
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
                  borderColor:
                    item.classification === "NORMAL" ? "#28a745" : "#dc3545", // Conditional border color
                }}
              >
                <img
                  src={item.image}
                  alt={`Preview ${index}`}
                  style={styles.smallImage}
                />
                <p>{item.classification}</p>
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
  },
  uploadSection: {
    flex: 1,
    marginRight: "20px", // Adjust spacing between sections as needed
  },
  historySection: {
    width: "300px", // Adjust width as needed
    maxHeight: "600px", // Adjust height as needed
    overflowY: "auto", // Enable scrolling for long history lists
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    margin: "5px 0",
    border: "2px solid",
    borderRadius: "5px",
  },
  app: {
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f0f2f5",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  container: {
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
    borderRadius: "10px",
    backgroundColor: "white",
    padding: "20px",
    maxWidth: "600px",
    width: "100%",
  },
  heading: {
    color: "#333",
    marginBottom: "20px",
  },
  customFileUpload: {
    cursor: "pointer",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    borderRadius: "5px",
    display: "inline-block",
    margin: "10px 0",
    width: "auto",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    display: "inline-block",
    marginTop: "20px",
  },
  dropZone: {
    border: "2px dashed #007bff",
    padding: "20px",
    borderRadius: "10px",
    color: "#007bff",
    margin: "20px 0",
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
  result: (classification) => ({
    marginTop: "20px",
    padding: "10px",
    borderRadius: "5px",
    color: classification === "NORMAL" ? "#155724" : "#721c24",
    backgroundColor: classification === "NORMAL" ? "#d4edda" : "#f8d7da",
    display: "inline-block",
    width: "100%",
  }),
  historyContainer: {
    marginTop: "40px",
  },
  smallImage: {
    width: "50px",
    height: "50px",
    marginRight: "10px",
    borderRadius: "5px",
  },
  "@keyframes spin": {
    "0%": { transform: "rotate(0deg)" },
    "100%": { transform: "rotate(360deg)" },
  },
};

export default App;
