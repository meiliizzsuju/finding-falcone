import $ from 'jquery';
import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.scss';
import PlanetDropdown from './components/PlanetDropdown'
import Calulate from './components/Calculate'

function App() {
  const [planets, setPlanet] = useState([]);
  const [vehicles, setVehicle] = useState([]);
  const [selectedPlanet, setSelectedPlanet] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState([]);
  const [vehicleByDestination, setVehicleByDestination] = useState([]);
  const [submitStatus, setSubmitStatus] = useState('start');
  const [finalTime, setFinaltime] = useState(0);
  const [planetFound, setPlanetFound] = useState(0);
  const planetURL = 'https://5f5ff7f790cf8d00165573ed.mockapi.io/planets';
  const vehicleURL = 'https://5f5ff7f790cf8d00165573ed.mockapi.io/vehicles';
  const successMSG = 'Success! Congrats on Finding Falcone. King Shan is mighty pleased.';

  useEffect(() => {
    const getPlanets = async () => {
      const dataPlanet = await fetchData(planetURL);
      console.log(dataPlanet)
      setPlanet(dataPlanet);
    }

    const getVehicles = async () => {
      const dataVehicle = await fetchData(vehicleURL);
      const vList = filterVihicle(dataVehicle);
      setVehicle(vList);
    }

    const createVehicleByDestinationList = async () =>{
      const data = await fetchData(vehicleURL);
      const VbyDdata = filterVihicle(data);
      const VbyD = [
        {desno: 'destination_1', data:{VbyDdata}},
        {desno: 'destination_2', data:{VbyDdata}},
        {desno: 'destination_3', data:{VbyDdata}},
        {desno: 'destination_4', data:{VbyDdata}},
      ]
      setVehicleByDestination(VbyD);
    }


    getPlanets();
    getVehicles();
    createVehicleByDestinationList();
    console.log('start')
  }, []);


  // Fetch data from url
  const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data
  }

  // filter option from dropdown
  const getFilteredPlanets = (name) => {
    const removedItems = { ...selectedPlanet};
    delete removedItems[name];
    const removedItemsList = Object.values(removedItems);
    return planets.filter(item => {
      return !removedItemsList.includes(item.name);
    });
  }

  const filterVihicle = (list) =>{
    let finalList = [];
    list.forEach((v) => {
      let name = v.name;
      if(name.indexOf('NaN') <=0){
        finalList.push(v)
      }
    })
    return finalList;
  }

  const getPlanet = (name) => {
    return selectedPlanet[name];
  }

  const onSubmit = async (e) => {
    let planet_names = Object.values(selectedPlanet);
    let vehicle_names = Object.values(selectedVehicle);
    e.preventDefault()
    const res = await fetch(`https://5f5ff7f790cf8d00165573ed.mockapi.io/find`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        planet_names:planet_names,
        vehicle_names:vehicle_names
      }),
    })

    const data = await res.json()

    // if success
    if(data.status === 'success'){
      setSubmitStatus(data.status);
      setPlanetFound(data.planet_name);
    }


    
    console.log("onSubmit")
    console.log(planet_names)
    console.log(vehicle_names)
    console.log(data)
    console.log("submitStatus")
    console.log(submitStatus)
  }

  const revealSpaceOptions = (containerID,e) => {
    let dataEle = '[data-destination-container]';
    let dataradioWrapper = '[data-radio-wrapper]';
    let thisContainer =  $(e).closest(dataEle);
    let thisradio = thisContainer.children(dataradioWrapper);

    thisradio.addClass('reveal');
  }

  // on select show the next box
  const revealnextBox = (containerID,e) => {
    let dataEle = '[data-destination-container]';
    let thisContainer =  $(e).closest(dataEle);
    let nextContainer = thisContainer.next(dataEle);

    // adding reveal class to the box next to selected box
    nextContainer.addClass('reveal');
  }


  const selectItem = (containerID, value) => {
    console.log("selectItem : " + containerID + " and " + value)
    setSelectedPlanet({
      ...selectedPlanet,
      [containerID]: value
    });

  };


  const selectVehicle = (containerID, value, e) => {
    console.log('selectVehicle : '+containerID+ ' : '+value);
    setSelectedVehicle({
      ...selectedVehicle,
      [containerID]: value
    })
  };

  const onReset = () =>{
    window.location.reload(false);
    // setPlanet([])
    // setVehicle([])
    // setSelectedPlanet([])
    // setSelectedVehicle([])
    // setVehicleByDestination([])
    
    /*
    setSelectedPlanet('');
    setSelectedVehicle('');

    // hide all the boxes 
    let dataradioWrapper = $('[data-radio-wrapper]');
    let destinationWrapper = $('[data-destination-container]');
    dataradioWrapper.removeClass('reveal');
    destinationWrapper.not('[data-destination-container]:first-child').removeClass('reveal');



    // clear dropdowns
    let dropdowns = destinationWrapper.find('.dropdown');
    console.log("dropdowns")
    console.log(dropdowns)
    $('[data-destination-container] .dropdown').selectedIndex = 0;
    */
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Finding Falcone</h1>

        <div className="top-nav">
          <button onClick={onReset}>reset</button>
        </div>
      </header>
        {
          (submitStatus !== 'success') ? (
            (planets.length > 0 && vehicles.length > 0 && vehicleByDestination.length >0) ? (
              <div className="missioncontroll">
                <p>Select planets you want to search in:</p>
                <div className="missioncontroll_container">
    
                        
                          <React.Fragment>
                          <PlanetDropdown
                            name='destination_1'
                            vehicles={vehicles}
                            selectedVehicle={selectedVehicle}
                            selectVehicle={ selectVehicle}
                            VbyD={vehicleByDestination}
                            setVbyD={setVehicleByDestination}
                            planets={getFilteredPlanets('destination_1')}
                            value={getPlanet('destination_1')}
                            dropdownId='destination_1'
                            revealnextBox={revealnextBox}
                            revealSpaceOptions={revealSpaceOptions}
                            allplanets={planets}
                            selectItem={selectItem} id='1'
                            reveal={true} // show first box on load
                            />
                          <PlanetDropdown
                            name='destination_2'
                            vehicles={vehicles}
                            selectedVehicle={selectedVehicle}
                            selectVehicle={ selectVehicle}
                            VbyD={vehicleByDestination}
                            setVbyD={setVehicleByDestination}
                            planets={getFilteredPlanets('destination_2')}
                            value={getPlanet('destination_2')}
                            dropdownId='destination_2'
                            revealnextBox={revealnextBox}
                            revealSpaceOptions={revealSpaceOptions}
                            allplanets={planets}
                            selectItem={selectItem} id='2'/>
                          <PlanetDropdown
                            name='destination_3'
                            vehicles={vehicles}
                            vehiclesAvail={vehicles}
                            selectedVehicle={selectedVehicle}
                            selectVehicle={ selectVehicle}
                            VbyD={vehicleByDestination}
                            setVbyD={setVehicleByDestination}
                            planets={getFilteredPlanets('destination_3')}
                            value={getPlanet('destination_3')}
                            dropdownId='destination_3'
                            revealnextBox={revealnextBox}
                            revealSpaceOptions={revealSpaceOptions}
                            allplanets={planets}
                            selectItem={selectItem} id='3'/>
                          <PlanetDropdown
                            name='destination_4'
                            vehicles={vehicles}
                            selectedVehicle={selectedVehicle}
                            selectVehicle={ selectVehicle}
                            VbyD={vehicleByDestination}
                            setVbyD={setVehicleByDestination}
                            planets={getFilteredPlanets('destination_4')}
                            value={getPlanet('destination_4')}
                            dropdownId='destination_4'
                            revealnextBox={revealnextBox}
                            revealSpaceOptions={revealSpaceOptions}
                            allplanets={planets}
                            selectItem={selectItem} id='4'/>
                          </React.Fragment>
            
                      
                  
                </div>
                        
                <Calulate selectedVehicle={selectedVehicle} 
                  selectedPlanet={selectedPlanet}
                  vehicles={vehicles} planets={planets}
                  setFinaltime={setFinaltime}
                ></Calulate>
    
                <div className="missioncontroll_form">
                  <form className='fiding-form' onSubmit={onSubmit}>
                    <div className='form-control hidden'>
                      <label htmlFor="destination">placeholder</label>
                      <input type="text" data-finding-form-value/>
                    </div>
                    <button type="submit" value="Find Falcone!" className='btn btn-big'>
                      <span>Find Falcone!</span>
                    </button>
                  </form>
                </div>
              </div>
    
              ) : (
                'no data to show'
              )
          ) : (
            // on success
            <div className='successbox'>
              <div className='successbox-top'>
                <h3>{successMSG}</h3>
              </div>
              <div className='successbox-bottom'>
                <span>Time taken : {finalTime}</span>
                <span>Planet found : {planetFound}</span>
                <button onClick={onReset} className="btn-big">Start Again</button>
              </div>
            </div>
          )
        }
    </div>
  );
}

export default App;
