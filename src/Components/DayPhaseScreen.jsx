import React, { Component } from 'react';

class DayPhaseScreen extends Component {
    constructor(props){
        super(props);

        this.state = {
            alivePlayers: this.props.alivePlayers,
            commonersVictim: '',
            messageFirstPart: this.setMessageFirstPart(),
            messageSecondPart: this.setMessageSecondPart()
        };
    }

    getAlivePlayersSelect() {
        let alivePlayers = this.state.alivePlayers;

        let result =
            <select className="field text-select-width" onChange={this.props.confirmKillSelection}>
                <option key={"-1"} value="">--</option>
                {alivePlayers.map(name => <option key={name} value={name}>{name}</option>)}
            </select>;

        return result;
    }

    setMessageFirstPart() {
        return this.props.wolvesKill === '' ?
            'Nessuno' :
            this.props.wolvesKill;
    }

    setMessageSecondPart() {
        return this.props.wolvesKill === '' ?
            'Ma voi siete delle brutte persone, quindi dovete linciare qualcuno comunque' :
            'But the show must go on! Discutete di chi sia la colpa e decidete chi linciare';
    }

    render() {
      return (
        <div className="col-xs-12 col-xs-offset-3">
            <div className="col-xs-4">
                <strong>{this.state.messageFirstPart}</strong> è morto! <br/>{this.state.messageSecondPart}
            </div>
            <div className="col-xs-5">
                {this.getAlivePlayersSelect()}
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
