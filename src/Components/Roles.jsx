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

    getMaxNumberOfWolvesGivenPlayers(numberOfPlayers) {
        return Math.floor(numberOfPlayers / 3);
    }

    getMaxNumberOfGuards() {
        return 1;
    }

    getMaxNumberOfWhores() {
        return 1;
    }

    getMaxNumberOfCommoners(numberOfPlayers) {
        return numberOfPlayers - this.getMaxNumberOfWolvesGivenPlayers(numberOfPlayers)
                               - this.getMaxNumberOfGuards()
                               - this.getMaxNumberOfWhores();
    }
}

export default Roles;
