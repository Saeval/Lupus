import React, { Component } from 'react';
import Roles from "./Roles";

class EndGame extends Component {
    render() {
        let coloredListOfPlayers = [];
        const roles = new Roles();
        const allPlayers = this.props.allPlayers;

        for(let i = 0; i < allPlayers.length; i++) {
            if (!this.props.alivePlayers.includes(allPlayers[i])) continue;

            let playerName = allPlayers[i];
            let color = this.props.roles[i] === roles.getWolfRole() ?
                        'text-danger' : 'text-success';
            coloredListOfPlayers.push(({ name: playerName, textClass: color }));
        }

        return (
            <React.Fragment >
                <div className='jumbotron text-center title top-margin'>{this.props.message}</div>
                <div className='text-center'>Alive players at the end of the game:
                    <ul>
                        {coloredListOfPlayers.map(player => <li key={player.name} className={player.textClass}>{player.name}</li>)}
                    </ul>
                </div>
            </React.Fragment>
        )
    }
}

export default EndGame;
