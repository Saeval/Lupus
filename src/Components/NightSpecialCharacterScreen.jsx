import React, { Component } from 'react';

class NightSpecialCharacterScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            specialCharacterName: this.getName()
        };
    }

    getName() {
        console.log(`[getName][alivePlayers]: ${this.props.alivePlayers}`);

        for(let i = 0; i < this.props.playerRoles.length; i++)
            if (this.props.playerRoles[i] === this.props.specialRole) {
                console.log(`[NightGuardPhaseScreen][getName]: ${this.props.playerNames[i]}`);
                return this.props.playerNames[i];
            }
    }

    isSpecialCharacterAlive() {
        return this.props.alivePlayers.includes(this.state.specialCharacterName);
    }

    getPlayersSelect(){
        let players = this.props.alivePlayers.filter(player => player !== this.state.specialCharacterName);

        let result =
            <select className='field text-select-width' onChange={this.props.confirmSelection}>
                <option key={'-1'} value=''>--</option>
                {players.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    render() {
        let character = this.state.specialCharacterName;

        let buttonStyle = this.isSpecialCharacterAlive() ?
            {marginLeft: '22em', width: '80%'}:
            {width: '80%'};

        return (
          <div className="col-xs-12 col-xs-offset-3">
              <div className="col-xs-4">
                  {this.isSpecialCharacterAlive() ?
                      `${this.props.specialRole} ${character}, ${this.props.aliveMessage}` :
                      `${this.props.specialRole} ${character} is dead, so just pretend you are calling him` }
              </div>
              {this.isSpecialCharacterAlive() ?
                  <div className="col-xs-5">
                      {this.getPlayersSelect()}
                  </div> : ''
              }
              <div className={this.isSpecialCharacterAlive() ? "col-xs-2 col-xs-offset-2" : "col-xs-2"}>
                  <button className="col-xs-5 btn btn-primary top-margin right-margin"
                          onClick={this.props.handleChoice}
                          style={buttonStyle}>
                      Conferma
                  </button>
              </div>
          </div>
        )
    }
}

export default NightSpecialCharacterScreen;
