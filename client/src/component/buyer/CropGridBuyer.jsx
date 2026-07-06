import React from "react";
import CropCardBuyer from "./CropCardBuyer";

const CropGridBuyer = ({ crops }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
      {crops.map((crop) => (
        <CropCardBuyer key={crop._id} crop={crop} />
      ))}
    </div>
  );
};

export default CropGridBuyer;
