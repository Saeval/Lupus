import React, { Component } from 'react';
import Roles from "./Roles";

class NightSeerScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            specialCharacterName: this.getName(),
            hasYetToChoose: this.props.choice === '',
            isAlive: this.isSpecialCharacterAlive()
        };
    }

    getName() {
        console.log(`[getName][alivePlayers]: ${this.props.alivePlayers}`);

        for(let i = 0; i < this.props.playerRoles.length; i++)
            if (this.props.playerRoles[i] === new Roles().getSeerRole()) {
                console.log(`[NightSeerScreen][getName]: ${this.props.playerNames[i]}`);
                return this.props.playerNames[i];
            }
    }

    isSpecialCharacterAlive() {
        return this.props.alivePlayers.includes(this.getName());
    }

    getPlayersSelect(){
        let players = this.props.alivePlayers.filter(player => player !== this.state.specialCharacterName);

        let result =
            <select className='field text-select-width' onChange={this.props.handleSelection} defaultValue={this.props.choice}>
                <option key={'-1'} value=''>--</option>
                {players.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    componentWillMount(){
        if (!this.props.isPlaying)
            this.props.continueAction();
    }

    render() {
        //console.log('NightSeerScreen render');
        //console.log(this.props);
        let character = this.state.specialCharacterName;

        let buttonStyle = this.state.isAlive ?
            {marginLeft: '22em', width: '80%'}:
            {width: '80%'};

        let isConfirmChoiceButtonDisabled = this.state.hasYetToChoose && this.state.isAlive;

        return (
            <div className="col-xs-12 col-xs-offset-3">
                <div className="col-xs-4">
                    {this.state.isAlive ?
                        `Seer ${character}, pick someone whose identity you wish to know` :
                        `Seer ${character} is dead, so just pretend you are calling him` }
                </div>
                {this.state.isAlive ?
                    <div className="col-xs-5">
                        {this.getPlayersSelect()}
                    </div> : ''
                }

                <div className={this.state.isAlive ? "col-xs-2 col-xs-offset-2" : "col-xs-2"}>
                    <button className={`col-xs-5 btn btn-primary top-margin right-margin ${isConfirmChoiceButtonDisabled ? 'disabled' : ''}`}
                            onClick={isConfirmChoiceButtonDisabled ? null : this.props.continueAction}
                            style={buttonStyle}>
                        Continue
                    </button>

                    {this.props.confirmChoice === undefined ? '' :
                        <button className={`col-xs-5 btn btn-success top-margin right-margin ${isConfirmChoiceButtonDisabled ? '' : 'disabled'}`}
                                onClick={isConfirmChoiceButtonDisabled ? this.props.confirmChoice : null}
                                style={buttonStyle}>
                            Confirm
                        </button>
                    }

                    {this.state.hasYetToChoose ? '' :
                        this.props.supplementMessage === true ? <h1>YES</h1> : <h1>NOPE</h1>}
                </div>
            </div>
        )
    }
}

export default NightSeerScreen;
