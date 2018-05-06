import React, { Component } from 'react';

class DayPhaseScreen extends Component {
    render() {
      return (
        <div className="col-xs-12 col-xs-offset-3">
            <div className="col-xs-4">
                <strong>{this.props.victim}</strong> è morto! :( <br/>
                But the show must go on! Discutete dell'omicidio e decidete chi linciare:
            </div>
            <div className="col-xs-5">
                <select className="field text-select-width" onChange={this.props.confirmKillSelection}>
                    <option key={"-1"} value="">--</option>
                    {this.props.alivePlayers.map(name => <option key={name} value={name}>{name}</option>)}
                </select>
            </div>
            <div className="col-xs-2 col-xs-offset-2">
                <button className="col-xs-5 btn btn-primary top-margin"
                        onClick={this.props.handlePlayersVictimChoice}>
                    Conferma
                </button>
            </div>
        </div>
      )
    }
}

export default DayPhaseScreen;
