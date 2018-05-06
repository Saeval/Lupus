import React, { Component } from 'react';

class Roles extends Component {
    constructor(){
        super();
        this.state = {
            roles: [
                "Popolano",
                "Lupo"
            ]
        };
    }


    getRoles(){
        return this.state.roles;
    }

    getDefaultRole(){
        return this.state.roles[0];
    }
}

export default Roles;