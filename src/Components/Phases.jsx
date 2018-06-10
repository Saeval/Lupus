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
                4,  // Seer phase
                5,  // Wolves phase
                6,  // Day phase
                7   // End game phase
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

    getSeerPhase() {
        return this.state.phases.find(phase => phase === 4);
    }

    getWolvesPhase() {
        return this.state.phases.find(phase => phase === 5);
    }

    getDayPhase() {
        return this.state.phases.find(phase => phase === 6);
    }

    getEndGamePhase() {
        return this.state.phases.find(phase => phase === 7);
    }
}

export default Phases;
