import React, {Component} from 'react';
import {TextField, RaisedButton, Paper} from "material-ui";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import theme from "../utils/theme";
import {auth} from "../utils/auth.js";
import '../css/registro.css';
import {browserHistory} from 'react-router';

export default class Login extends Component {

    constructor(props) {
        super(props);
        if (this.props.location.query.msg) {
            this.state = {msg: this.props.location.query.msg, pwdError: '', emailError: ''};
        } else {
            this.state = {msg: '', pwdError: '', emailError: ''};
        }
    }

    componentDidMount() {
        if (localStorage.getItem('auth-token') !== null) {
            browserHistory.replace("/dashboard");
        }
    }

    valida() {
        if (this.login.input.value !== '' && this.senha.input.value !== '') {
            return true;
        } else {
            if (this.login.input.value === '') {
                this.setState({emailError: 'Não pode estar vazio!'})
            }
            if (this.senha.input.value === '') {
                this.setState({pwdError: 'Não pode estar vazio!'});
            }
            return false;
        }
    }

    envia(event) {
        event.preventDefault();

        if (!this.valida()) {
            return;
        }

        auth.signInWithEmailAndPassword(this.login.input.value, this.senha.input.value)
            .then((user) => {
                user.getIdToken().then(token => {
                    localStorage.setItem('auth-token', token);
                    browserHistory.push("/dashboard");
                });
            })
            .catch(error => {
                this.setState({msg: "Usuário ou senha incorretos!"});
                console.log(error.code);
            });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={theme}>
                <Paper className="login-box">
                    <div><span>{this.state.msg}</span></div>
                    <form onSubmit={this.envia.bind(this)}>
                        <TextField style={{width: "25vw"}} className="input-field" type="text"
                                   floatingLabelText="Email"
                                   ref={(input) => this.login = input}
                                   errorText={this.state.emailError}
                                   onChange={() => this.setState({emailError: ''})}/>
                        <TextField style={{width: "25vw"}} className="input-field" type="password"
                                   floatingLabelText="Senha"
                                   ref={(input) => this.senha = input}
                                   errorText={this.state.pwdError}
                                   onChange={() => this.setState({pwdError: ''})}/>

                        <RaisedButton primary={true} type="submit" label="login"
                                      style={{
                                          marginTop: '20px',
                                          float: 'right',
                                          display: 'inline-block'
                                      }}/>
                    </form>
                </Paper>
            </MuiThemeProvider>
        );
    }
}
