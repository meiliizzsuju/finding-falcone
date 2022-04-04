import React from 'react';

const Calculate = ({selectedVehicle,selectedPlanet, vehicles, planets,setFinaltime}) => {
  const selectedVehicleOb = Object.values(selectedVehicle)
  const selectedPlanetOb = Object.values(selectedPlanet)


  const getTime = () =>{

    let timeTaken = 0;
    let totalDistance = 0;
    let totalSpeed = 0;
    let distanceObj = [];
    let speedObj = [];

    if(selectedPlanet.length <= 0 || selectedVehicle.length <= 0) return timeTaken;


    for(let d =0; d < selectedPlanetOb.length; d++){
      // get the destination distance
      let destination = planets.filter(obj => {
        return obj.name === selectedPlanetOb[d]
      })

      distanceObj.push(destination[0].distance);

      totalDistance = totalDistance + destination[0].distance;
    }


    for(let i =0; i < selectedVehicleOb.length; i++){
      // match the list to get ditance and speed
      let vehicle = vehicles.filter(obj => {
        return obj.name === selectedVehicleOb[i]
      })

      speedObj.push(vehicle[0].speed);

      totalSpeed = totalSpeed + vehicle[0].speed

    }


    // total dictance / total speed for each destination
    let mapTimeTaken = distanceObj.map( (num,i) => {
      return num/speedObj[i]
    })

    // sum time taken each destination
    let numOr0 = n => isNaN(n) ? 0 : n;
    timeTaken = mapTimeTaken.reduce((a, b) => numOr0(a) + numOr0(b));


    setFinaltime(timeTaken);
    return timeTaken
  }

  getTime();
  
  return (
    <div className="missioncontroll_cal">
      <div className="missioncontroll_cal-box">
        <span className="missioncontroll_cal-label">
          Time taken :
        </span>
        <span className="missioncontroll_cal-result" selectedVehicle={selectedVehicle}>
          {getTime()}
        </span>
      </div>
    </div>
  );
}

export default Calculate;
