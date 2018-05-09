import React, { Component } from 'react';
import Roles from "./Roles";

class NightWolvesPhaseScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            wolves: this.getAliveWolves(),
            commoners: this.getAliveCommoners()
        };
    }

    getAliveWolves(){
        let wolves = [];
        const alivePlayers = this.props.alivePlayers;
        const playerNames = this.props.playerNames;
        const wolfRole = new Roles().getRoleByName('lupo');

        for(let i = 0; i < this.props.playerRoles.length; i++)
            if (this.props.playerRoles[i] === wolfRole && alivePlayers.includes(playerNames[i]))
                wolves.push(playerNames[i]);

        console.log(`Set wolves to: ${wolves}`);

        return wolves;
    }

    getAliveCommoners(){
        let wolves = this.getAliveWolves();
        let commoners = this.props.alivePlayers.filter(player => !wolves.includes(player));

        //console.log(`Set commoners to: ${commoners}`);

        return commoners;
    }

    getCommonersSelect(){
        let commoners = this.state.commoners;

        let result =
            <select className='field text-select-width' onChange={this.props.confirmKillSelection}>
                <option key={'-1'} value=''>--</option>
                {commoners.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    render() {
        let wolves = this.state.wolves;
        let killSomeoneText = wolves.length === 1 ?
                            `Lupo ${wolves[0]}, decidi chi accoppare` :
                            `Lupi ${wolves.join(', ')}, accordatevi sul chi accoppare`;
        return (
          <div className="col-xs-12 col-xs-offset-3">
              <div className="col-xs-4">
                  {killSomeoneText}
              </div>
              <div className="col-xs-5">
                  {this.getCommonersSelect()}
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
