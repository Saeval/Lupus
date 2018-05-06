import React, { Component } from 'react';

class Player extends Component {
    constructor(props){
        super(props);
        this.state = {
            index: -1,
            name: "",
            role: ""
        }
    }

    render() {
        return(
            /*{<select key={"select-role-" + this.props.keyNumber}
                    className={this.props.className}
                    onChange={this.props.handlePlayerRoleChange}
                    defaultValue={this.props.defaultValue}
            >
                {this.props.roles.map(role => <option key={"role-" + role + "-" + this.props.keyNumber} value={role}>{role}</option>)}
            </select>}*/
            <div>
                <div className="col-xs-4" id="playersNamesDiv">
                    {this.props.playersNames}
                </div>
                <div className="col-xs-4 wide-right-margin">
                    {this.state.playersRoles}
                </div>
            </div>
        );
    }
}

export default Player;