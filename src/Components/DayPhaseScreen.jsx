import React, { Component } from 'react';

class DayPhaseScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            alivePlayers: this.props.alivePlayers,
            wolvesKill: this.props.wolvesKill,
            commonersVictim: ''
        };
    }

    extracted() {
        let alivePlayers = this.state.alivePlayers;

        let result =
            <select className="field text-select-width" onChange={this.props.confirmKillSelection}>
                <option key={"-1"} value="">--</option>
                {alivePlayers.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    render() {
      return (
        <div className="col-xs-12 col-xs-offset-3">
            <div className="col-xs-4">
                <strong>{this.state.wolvesKill}</strong> è morto! :( <br/>
                But the show must go on! Discutete dell'omicidio e decidete chi linciare:
            </div>
            <div className="col-xs-5">
                {this.extracted()}
            </div>
            <div className="col-xs-2 col-xs-offset-2">
                <button className="col-xs-5 btn btn-primary top-margin"
                        onClick={this.props.handleCommonersChoice}>
                    Conferma
                </button>
            </div>
        </div>
      );
    }
}

export default DayPhaseScreen;
