import React, { Component } from 'react';

class Roles extends Component {
    constructor(){
        super();
        this.state = {
            roles: [
                'Popolano',
                'Lupo',
                'Guardia'
            ]
        };
    }

    getRoles(){
        return this.state.roles;
    }

    getDefaultRole(){
        return this.state.roles[0];
    }

    getWolfRole() {
        return this.state.roles[1];
    }

    getGuardRole() {
        return this.state.roles[2];
    }

    getRoleByName(roleName){
        const roles = this.state.roles;
        for(let i = 0; i < roles.length; i++)
            if (this.state.roles[i].toLowerCase() === roleName.toLowerCase()) return this.state.roles[i];

      return 'Ruolo non presente';
    }
}

export default Roles;
