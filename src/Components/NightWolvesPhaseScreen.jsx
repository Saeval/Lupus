import React, { Component } from 'react';
import Roles from "./Roles";

class NightWolvesPhaseScreen extends Component {
  // constructor(props){
  //     super(props);
  // }

  getWolvesNames(){
    let result = [];

    for(let i = 0; i < this.props.playerRoles.length; i++)
      if (this.props.playerRoles[i] === new Roles().getRoleByName('lupo'))
        result.push(this.props.playerNames[i]);

    return result;
  }

  getCommoners(){
    let commoners = [];

    for(let i = 0; i < this.props.playerRoles.length; i++)
      if (this.props.playerRoles[i] === new Roles().getDefaultRole())
        commoners.push(this.props.playerNames[i]);

      let result =
      <select className="field text-select-width" onChange={this.props.confirmKillSelection}>
          {commoners.map(name => <option key={name} value={name}>{name}</option>)}
      </select>;

    return result;
  }

    render() {
      let wolvesNames = this.getWolvesNames();
      let killSomeoneText = wolvesNames.length === 1 ?
                            `Lupo ${wolvesNames[0]}, decidi chi accoppare` :
                            `Lupi ${wolvesNames.join(', ')}, accordatevi sul chi accoppare`
        return (
          <div className="col-xs-12 col-xs-offset-3">
              <div className="col-xs-4">
                  {killSomeoneText}
              </div>
              <div className="col-xs-5">
                  {this.getCommoners()}
              </div>
              <div className="col-xs-2 col-xs-offset-2">
                  <button className="col-xs-5 btn btn-primary top-margin right-margin confirm-players-button"
                          onClick={this.props.handleWolvesChoice}>
                      Conferma
                  </button>
              </div>
          </div>
        )
    }
}

export default NightWolvesPhaseScreen;
