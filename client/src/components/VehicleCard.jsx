import React from 'react';

const VehicleCard = ({ vehicle }) => {
  return (
    <div>
      <h3>{vehicle.name}</h3>
      <p>{vehicle.make} {vehicle.model}</p>
      {/* Add more vehicle details and a link to the details page */}
    </div>
  );
};

export default VehicleCard;
