import React, { Component } from 'react';

class GameStates extends Component {
    getStates(){
        const states = [
            "PlayerSelection",
            "PlayerData",
            "Night",
            "Day"
        ];
        return states;
    }
}

export default GameStates;