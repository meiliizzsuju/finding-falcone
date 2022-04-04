import $ from 'jquery';
import React from 'react'
import { Fragment } from 'react/cjs/react.production.min';
import VehicleRadio from '../components/VehicleRadio'

export default class PlanetDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.reveal = (this.props.reveal) ? ('reveal') : ('');
    this.containerClass = 'destination-box' + ' '+this.reveal; // spacing for classname
    this.selectClass = 'destination_dropdown_'+this.props.id;
    this.updatedState = [];
    console.log("check this")
    console.log('this.props.selectedPlanet')
    console.log(this.props.selectedPlanet)
  }


  // hide space that cant reac to the planet
  disableSpaceOption = (i,e) => {
    let thisContainer = $(e.target).parents('[data-destination-container]');
    let thisRadioBox = $(thisContainer).find('[data-radio-checkbox]');
    let radioswrapper = $(thisRadioBox).find('fieldset');
    let radios = $(radioswrapper).find('[data-distance]');

    let noAvailClass = 'not-avail';
    $(radios).removeClass(noAvailClass);


    let planetData = this.props.allplanets.filter(obj => {
      return obj.name === i
    })


    // if space ship max distance < planetData.distance : hide the space ship
    for(let r =0; r < radios.length; r++){
      var spaceDistance = $(radios[r]).data('distance');
      if(parseInt(spaceDistance) < parseInt(planetData[0].distance)){
        $(radios[r]).addClass(noAvailClass);
      }
    }
  }

  onSelectPlanet = event => {
    this.props.selectItem(this.props.name, event.target.value);
    this.props.revealSpaceOptions(this.props.dropdownId, event.target);
    this.disableSpaceOption(event.target.value,event);
  };

  onSelectVehicles = event => {
    console.log("onSelectVehicles")
    this.props.selectVehicle(this.props.name,event.target.value, event.target);
    this.props.revealnextBox(this.props.dropdownId, event.target);
  }

  // filter radio option
  getFilteredVehicles = (name) => {
     console.log('getFilteredVehicles');
    let targetListdata;
    // loop per destination box
    this.props.VbyD.forEach((obItem) => {
      if(obItem.desno.toLowerCase() === name.toLowerCase()){
        let selectedItems = { ...this.props.selectedVehicle};
        let selectedItemsList = Object.values(selectedItems);
        let selectedKeyItemsList = Object.keys(selectedItems);

        if(selectedItemsList.length >0){
          return selectedKeyItemsList.forEach((selectedKey) =>{
            if(obItem.desno.toLowerCase() === selectedKey.toLowerCase()){
              return obItem.data.VbyDdata.forEach( (shipData) => {
                if(shipData.name.toLowerCase() === selectedItems[selectedKey].toLowerCase()){
                  if(this.updatedState.length === 0){
                    let updatestate = {}
                    updatestate.name = shipData.name.toLowerCase();
                    updatestate.updated = true; 
                    this.updatedState.push(updatestate)
                    this.setState(updatestate);
                    shipData.total_no = shipData.total_no-1;
                    return;
                  }
                }
              })
            }
          })
        }


      } 
      return targetListdata = Object(obItem.data.VbyDdata);
    });

    return targetListdata
  }

  render() {
    return (
      <Fragment>
      <div className={this.containerClass} id={'destination_'+this.props.id}
        data-destination-container
      >
        <div className="destination-box_top">
          <span className="destination-box_top_title">
            Destination { this.props.id }
          </span>
          <div className="destination-box_dropdown" >
            <select id={this.selectClass} onChange={this.onSelectPlanet} value={this.props.value}
              className='dropdown'
            >
              <option value='0'>Choose from the option</option>
              {
                this.props.planets.map((planet,index) => { 
                  return <option value={planet.name}
                              key={index}
                              distance={planet.distance}
                              index={index} 
                            >
                                {planet.name}
                            </option>
                })
              }
              </select>
          </div>
        </div>
        {
          (this.props.vehicles.length > 0 ) ? (
            <div className="destination-box_bottom" data-radio-wrapper>
              <div className="vehicles" data-type="vehicles-checkbox" data-radio-checkbox id={'vehicles_'+this.props.id}>
                <fieldset id={'vehicles_group_'+this.props.id} onChange={this.onSelectVehicles}>
                {
                  this.getFilteredVehicles(this.props.name).map((vehicle,index)=>{
                    return <VehicleRadio vehicle={vehicle} 
                      groupid={'vehicles_group_'+this.props.id}
                      name={this.props.name}
                      index={index} id={index+1} key={index} 
                      ></VehicleRadio>
                  })
                }
                </fieldset>
              </div>
            </div>
          ) : (
            'No vehicle data'
          )
        }
      </div>   
      </Fragment>
    )
  }
}
