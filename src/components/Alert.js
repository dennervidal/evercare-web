import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {IconButton, FontIcon, RaisedButton} from 'material-ui';

export default class Alert extends Component {

    constructor() {
        super();
        this.state = {open: true};
    }

    handleClose() {
        this.setState({open: false});
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.msg !== nextProps.msg) {
            this.setState({open: true});
        }
    }

    render() {
        return (
            <div>
                <Dialog
                    title="Alerta"
                    actions={
                        <FlatButton
                            label="OK"
                            primary={true}
                            onTouchTap={this.handleClose.bind(this)}
                        />}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}
                >
                    {this.props.msg}
                </Dialog>
            </div>
        );
    }
}

export class DeleteButton extends Component {

    constructor() {
        super();
        this.state = {open: false};
    }

    handleClose() {
        this.setState({open: false});
    }

    handleOpen() {
        this.setState({open: true});
    }

    callback() {
        this.props.cb(this.props.chave);
        this.setState({open: false});
    }

    render() {
        return (
            <div>
                <IconButton onTouchTap={this.handleOpen.bind(this)} style={{float: 'left'}}>
                    <FontIcon className="material-icons">clear</FontIcon>
                </IconButton>
                <Dialog
                    title="Alerta"
                    actions={[
                        <FlatButton
                            label="Cancelar"
                            primary={true}
                            onTouchTap={this.handleClose.bind(this)}
                        />,
                        <RaisedButton
                            label="Remover"
                            primary={true}
                            onTouchTap={this.callback.bind(this)}
                        />]}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose.bind(this)}
                >
                    {this.props.msg}
                </Dialog>
            </div>
        );
    }
}
