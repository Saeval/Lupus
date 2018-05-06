import React, { Component } from 'react';

class GameStates extends Component {
    getStates(){
        const states = [
            "PlayerSelection",  //0
            "PlayerData",       //1
            "Night-Wolves",     //2
            "Day"               //3
        ];
        return states;
    }
}

export default GameStates;
