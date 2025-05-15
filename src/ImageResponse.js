// ImageResponse.js
import React from 'react';

const ImageResponse = ({ payload }) => {
  const { imageUrl } = payload;
  
  return (
    <div className="image-response-container">
      <img 
        src={imageUrl || "/placeholder.svg"} 
        alt="Bot response" 
        className="response-image"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
        }}
      />
    </div>
  );
};

export default ImageResponse;