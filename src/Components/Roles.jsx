import React, { Component } from 'react';

const commonerRole = 'Commoner';
const wolfRole = 'Wolf';
const guardRole = 'Guard';
const whoreRole = 'Whore';
const seerRole = 'Seer';
const possessedRole = 'Possessed';

class Roles extends Component {
    constructor(){
        super();
        this.state = {
            roles: [
                commonerRole,
                wolfRole,
                guardRole,
                whoreRole,
                seerRole,
                possessedRole
            ]
        };
    }

    getAllRoles() {
        return this.state.roles;
    }

    getDefaultRole() {
        return this.state.roles.find(role => role === commonerRole);
    }

    getWolfRole() {
        return this.state.roles.find(role => role === wolfRole);
    }

    getGuardRole() {
        return this.state.roles.find(role => role === guardRole);
    }

    getWhoreRole() {
        return this.state.roles.find(role => role === whoreRole);
    }

    getSeerRole() {
        return this.state.roles.find(role => role === seerRole);
    }

    getPossessedRole() {
        return this.state.roles.find(role => role === possessedRole);
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

    getMaxNumberOfPossessed(numberOfPlayers) {
        return numberOfPlayers > 8 ? 1 : 0;
    }

    getMaxNumberOfCommoners(numberOfPlayers) {
        return numberOfPlayers - this.getMaxNumberOfWolves(numberOfPlayers)
                               - this.getMaxNumberOfGuards(numberOfPlayers)
                               - this.getMaxNumberOfWhores(numberOfPlayers)
                               - this.getMaxNumberOfPossessed(numberOfPlayers)
                               - this.getMaxNumberOfSeers(numberOfPlayers);
    }
}

export default Roles;
