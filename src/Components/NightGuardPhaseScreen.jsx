import React, { Component } from 'react';
import Roles from "./Roles";

class NightGuardPhaseScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            guardName: this.getGuardName(),
        };
    }

    getGuardName() {
        //console.log(`[getGuardName][alivePlayers]: ${this.props.alivePlayers}`);

        for(let i = 0; i < this.props.playerRoles.length; i++)
            if (this.props.playerRoles[i] === new Roles().getGuardRole()) {
                //console.log(`[NightGuardPhaseScreen][getGuardName]: ${this.props.playerNames[i]}`);
                return this.props.playerNames[i];
            }
    }

    getPlayersSelect(){
        let players = this.props.alivePlayers.filter(player => player !== this.state.guardName);

        let result =
            <select className='field text-select-width' onChange={this.props.confirmGuardSelection}>
                <option key={'-1'} value=''>--</option>
                {players.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    render() {
        let guard = this.state.guardName;

        return (
          <div className="col-xs-12 col-xs-offset-3">
              <div className="col-xs-4">
                  {`Guard ${guard}, pick someone to protect`}
              </div>
              <div className="col-xs-5">
                  {this.getPlayersSelect()}
              </div>
              <div className="col-xs-2 col-xs-offset-2">
                  <button className="col-xs-5 btn btn-primary top-margin right-margin"
                          onClick={this.props.handleGuardChoice}
                          style={{marginLeft: '22em', width: '80%'}}>
                      Conferma
                  </button>
              </div>
          </div>
        )
    }
}

export default NightGuardPhaseScreen;
