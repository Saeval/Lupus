import React, { Component } from 'react';

class Phases extends Component {
    constructor(){
        super();
        this.state = {
            phases: [
                0,  // Player selection phase
                1,  // Player names phase
                2,  // Guard phase
                3,  // Whore phase
                4,  // Wolves phase
                5,  // Day phase
                6   // End game phase
            ]
        };
    }

    getPhases() {
        return this.state.phases;
    }

    getPlayerSelectionPhase() {
        return this.state.phases.find(phase => phase === 0);
    }

    getPlayerDataPhase() {
        return this.state.phases.find(phase => phase === 1);
    }

    getGuardPhase() {
        return this.state.phases.find(phase => phase === 2);
    }

    getWhorePhase() {
        return this.state.phases.find(phase => phase === 3);
    }

    getWolvesPhase() {
        return this.state.phases.find(phase => phase === 4);
    }

    getDayPhase() {
        return this.state.phases.find(phase => phase === 5);
    }

    getEndGamePhase() {
        return this.state.phases.find(phase => phase === 6);
    }
}

export default Phases;
