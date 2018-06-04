import React, { Component } from 'react';

class Phases extends Component {
    constructor(){
        super();
        this.state = {
            phases: [
                0,  // Player selection phase
                3,  // Player names phase
                5,  // Guard phase
                9,  // Whore phase
                10,  // Wolves phase
                11,  // Day phase
                13   // End game phase
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
        return this.state.phases.find(phase => phase === 3);
    }

    getGuardPhase() {
        return this.state.phases.find(phase => phase === 5);
    }

    getWhorePhase() {
        return this.state.phases.find(phase => phase === 9);
    }

    getWolvesPhase() {
        return this.state.phases.find(phase => phase === 10);
    }

    getDayPhase() {
        return this.state.phases.find(phase => phase === 11);
    }

    getEndGamePhase() {
        return this.state.phases.find(phase => phase === 13);
    }

    getIndexByCurrentPhase(currentPhase) {
        let allPhases = this.state.phases;
        for (let i = 0; i < allPhases.length; i++) {
            if (allPhases[i] === currentPhase)
                return i;
        }
    }
}

export default Phases;
