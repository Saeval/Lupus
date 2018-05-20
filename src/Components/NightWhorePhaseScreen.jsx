import React, { Component } from 'react';
import Roles from "./Roles";

class NightWhorePhaseScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            whoreName: this.getWhoreName(),
        };
    }

    getWhoreName() {
        //console.log(`[getGuardName][alivePlayers]: ${this.props.alivePlayers}`);

        for(let i = 0; i < this.props.playerRoles.length; i++)
            if (this.props.playerRoles[i] === new Roles().getWhoreRole()) {
                console.log(`[getWhoreName][getWhoreName]: ${this.props.playerNames[i]}`);
                return this.props.playerNames[i];
            }
    }

    getPlayersSelect(){
        let players = this.props.alivePlayers.filter(player => player !== this.state.whoreName);

        let result =
            <select className='field text-select-width' onChange={this.props.confirmWhoreSelection}>
                <option key={'-1'} value=''>--</option>
                {players.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    render() {
        let whore = this.state.whoreName;

        return (
            <div className="col-xs-12 col-xs-offset-3">
                <div className="col-xs-4">
                    {`Whore ${whore}, pick someone to have fun with tonight`}
                </div>
                <div className="col-xs-5">
                    {this.getPlayersSelect()}
                </div>
                <div className="col-xs-2 col-xs-offset-2">
                    <button className="col-xs-5 btn btn-primary top-margin right-margin"
                            onClick={this.props.handleWhoreChoice}
                            style={{marginLeft: '22em', width: '80%'}}>
                        Conferma
                    </button>
                </div>
            </div>
        )
    }
}

export default NightWhorePhaseScreen;
