import React, { Component } from 'react';
import Roles from "./Roles";

class NightWolvesPhaseScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            commoners: [],
            wolves: []
        };
    }

    getWolvesNames(){
        let wolves = [];

        for(let i = 0; i < this.props.playerRoles.length; i++)
            if (this.props.playerRoles[i] === new Roles().getRoleByName('lupo'))
                wolves.push(this.props.alivePlayers[i]);

        return wolves;
    }

    getCommoners(){
        let commoners = [];

        for(let i = 0; i < this.props.playerRoles.length; i++)
            if (this.props.playerRoles[i] === new Roles().getDefaultRole())
                commoners.push(this.props.alivePlayers[i]);

            let result =
            <select className="field text-select-width" onChange={this.props.confirmKillSelection}>
                <option key={'-1'} value=''>--</option>
                {commoners.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    render() {
        let wolvesNames = this.getWolvesNames();
        let killSomeoneText = wolvesNames.length === 1 ?
                            `Lupo ${wolvesNames[0]}, decidi chi accoppare` :
                            `Lupi ${wolvesNames.join(', ')}, accordatevi sul chi accoppare`;
        return (
          <div className="col-xs-12 col-xs-offset-3">
              <div className="col-xs-4">
                  {killSomeoneText}
              </div>
              <div className="col-xs-5">
                  {this.getCommoners()}
              </div>
              <div className="col-xs-2 col-xs-offset-2">
                  <button className="col-xs-5 btn btn-primary top-margin right-margin"
                          onClick={this.props.handleWolvesChoice}
                          style={{marginLeft: '22em', width: '80%'}}>
                      Conferma
                  </button>
              </div>
          </div>
        )
    }
}

export default NightWolvesPhaseScreen;
