import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import {Avatar, Chip, RaisedButton} from 'material-ui';


export default class MedChip extends Component {

    constructor() {
        super();
        this.state = {open: false};
    }

    handleClose = () => {
        this.setState({open: false});
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    callback = () => {
        this.props.cb(this.props.medId);
        this.setState({open: false});
    };

    render() {
        return (
            <div>
                <Chip style={{margin: '1px', float: 'left'}}
                      onRequestDelete={this.handleOpen}
                      onClick={() => this.props.tap(this.props.medId)}>
                    <Avatar src={this.props.foto !== undefined ? this.props.foto.photo : ''}/>
                    {this.props.nome}
                </Chip>
                <Dialog
                    title="Alerta"
                    actions={[
                        <FlatButton
                            label="Cancelar"
                            primary={true}
                            onTouchTap={this.handleClose}
                        />,
                        <RaisedButton
                            label="Remover"
                            primary={true}
                            onTouchTap={this.callback}
                        />]}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.handleClose}
                >
                    Deseja remover o medicamento?
                </Dialog>
            </div>
        );
    }
}
