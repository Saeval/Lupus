import React, { Component } from 'react';

class Roles extends Component {
    constructor(){
        super();
        this.state = {
            roles: [
                'Commoner',
                'Wolf',
                'Guard',
                'Whore',
                'Seer'
            ]
        };
    }

    getAllRoles() {
        return this.state.roles;
    }

    getDefaultRole() {
        return this.state.roles.find(role => role === 'Commoner');
    }

    getWolfRole() {
        return this.state.roles.find(role => role === 'Wolf');
    }

    getGuardRole() {
        return this.state.roles.find(role => role === 'Guard');
    }

    getWhoreRole() {
        return this.state.roles.find(role => role === 'Whore');
    }

    getSeerRole() {
        return this.state.roles.find(role => role === 'Seer');
    }

    getRoleByName(roleName){
        const roles = this.state.roles;
        for(let i = 0; i < roles.length; i++)
            if (this.state.roles[i].toLowerCase() === roleName.toLowerCase()) return this.state.roles[i];

      return 'Role not existing';
    }

    getMaxNumberOfWolves(numberOfPlayers) {
        return numberOfPlayers === 6 ? 1 : Math.floor(numberOfPlayers / 3);
    }

    getMaxNumberOfGuards(numberOfPlayers) {
        return numberOfPlayers > 5 ? 1 : 0;
    }

    getMaxNumberOfWhores(numberOfPlayers) {
        return numberOfPlayers > 6 ? 1 : 0;
    }

    getMaxNumberOfSeers(numberOfPlayers) {
        return numberOfPlayers > 7 ? 1 : 0;
    }

    getMaxNumberOfCommoners(numberOfPlayers) {
        return numberOfPlayers - this.getMaxNumberOfWolves(numberOfPlayers)
                               - this.getMaxNumberOfGuards(numberOfPlayers)
                               - this.getMaxNumberOfWhores(numberOfPlayers)
                               - this.getMaxNumberOfSeers(numberOfPlayers);
    }
}

export default Roles;
