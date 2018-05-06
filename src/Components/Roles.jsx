import React, { Component } from 'react';

class Roles extends Component {
    constructor(){
        super();
        this.state = {
            roles: [
                'Popolano',
                'Lupo'
            ]
        };
    }

    getRoles(){
        return this.state.roles;
    }

    getDefaultRole(){
        return this.state.roles[0];
    }

    getRoleByName(roleName){
      for(let i = 0; i < this.state.roles.length; i++)
        if (this.state.roles[i].toLowerCase() === roleName.toLowerCase()) return this.state.roles[i];

      return 'Ruolo non presente';
    }
}

export default Roles;
