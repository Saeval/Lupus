import React, { Component } from 'react';

class DayPhaseScreen extends Component {
  getStillAlivePlayers(){
    let alivePlayers = this.props.players.filter(name => name !== this.props.victim);

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
                <strong>{this.props.victim}</strong> è morto! :('<br/> But the show must go on! Discutete dell'omicidio e decidete chi linciare:
            </div>
            <div className="col-xs-5">
                {this.getStillAlivePlayers()}
            </div>
            <div className="col-xs-2 col-xs-offset-2">
                <button className="col-xs-5 btn btn-primary top-margin"
                        onClick={this.props.handleWolvesChoice}>
                    Conferma
                </button>
            </div>
        </div>
      )
    }
}

export default DayPhaseScreen;
