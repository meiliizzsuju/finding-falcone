import React from 'react';

const Vehicleradio = ({ vehicle,groupid,name,index,id,key}) => {
  let vehicleID = 'vehicles-'+id;

  return (
    <span class={(vehicle.name <=0) ? 'avail' : ''} className="radio-wraper"
    data-avail={(vehicle.total_no <= 0)? false : ''}
    data-distance={vehicle.max_distance}
    >
        <label htmlFor={vehicleID}>{vehicle.name}
          <input type="radio" id={vehicleID} name={groupid} 
          value={vehicle.name} />
          <span class="checkmark"></span>
          <span data-vehicle-avail>({vehicle.total_no})</span>
        </label>
    </span>
  );
}

export default Vehicleradio;
