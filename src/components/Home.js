import React, { Component } from 'react';
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import theme from "../utils/theme";
import {auth} from "../utils/auth";
import {AppBar, Drawer, MenuItem} from "material-ui";
import {browserHistory} from 'react-router';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {open: false, title: "Dashboard"};
    }

    componentDidMount() {
        if (localStorage.getItem('auth-token') === null) {
            browserHistory.replace("/?msg=Você precisa estar logado");
        }
    }

    logout = () => {
        auth.signOut().then(() => {
            this.setState({open: false});
            localStorage.removeItem('auth-token');
            browserHistory.push("/");
        });
    };

    handleToggle = () => {
        this.setState({open: !this.state.open});
    };

    handleElders = () => {
        browserHistory.push("/idosos");
        this.setState({open: false, title: "Idosos"});
    };

    handleMeds = () => {
        browserHistory.push("/remedios");
        this.setState({open: false, title: "Remédios"});
    };

    handleReads = () => {
        browserHistory.push("/leituras");
        this.setState({open: false, title: "Leituras"});
    };

    handleDash = () => {
        browserHistory.push("/dashboard");
        this.setState({open: false, title: "Dashboard"});
    };

    render() {
        return (
            <MuiThemeProvider muiTheme={theme}>
                <div>
                    <AppBar
                        title={this.state.title}
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onLeftIconButtonTouchTap={this.handleToggle}
                    />
                    {this.props.children}
                    <Drawer open={this.state.open}
                            docked={false}
                            onRequestChange={(open) => this.setState({open})}>
                        <AppBar
                            title="Menu"
                            iconClassNameRight="muidocs-icon-navigation-expand-more"
                            onLeftIconButtonTouchTap={this.handleToggle}
                        />
                        <MenuItem onTouchTap={this.handleDash}>Dashboard</MenuItem>
                        <MenuItem onTouchTap={this.handleElders}>Idosos</MenuItem>
                        <MenuItem onTouchTap={this.handleMeds}>Remédios</MenuItem>
                        <MenuItem onTouchTap={this.handleReads}>Leituras</MenuItem>

                        <MenuItem style={{bottom: '0', width: '100%', position: 'absolute', textAlign: 'center'}}
                                  onTouchTap={this.logout}>Sair</MenuItem>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default Home;
