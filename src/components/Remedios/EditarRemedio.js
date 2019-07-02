import React, {Component} from 'react';
import '../../css/registro.css';
import {
    TextField,
    RaisedButton,
    IconButton,
    FontIcon,
    Dialog
} from 'material-ui';
import {database, auth} from "../../utils/auth.js";

export default class EditarRemedio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            foto: '',
            dosagem: '',
            unidade: '',
            key: '',
            nome: '',
            erroNome: '',
            erroUnit: '',
            erroDose: ''
        };
    }

    handleTap = (event) => {
        event.preventDefault();
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    carregaPopover(key) {
        const ref = database.ref("usuarios").child(auth.currentUser.uid).child("remedios").child(key);
        ref.on("value", data => {
            const med = data.val();
            this.setState({
                key: key,
                validExt: true,
                foto: med.foto,
                nome: med.nome,
                unidade: med.unidade,
                dosagem: med.dosagem
            });
        });
    }

    componentWillMount() {
        this.carregaPopover(this.props.chave);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.firebaseKey !== this.props.firebaseKey) {
            this.carregaPopover(nextProps.firebaseKey);
        }
    }

    validar = (nome, dosagem, unidade) => {
        if ((nome !== '') &&
            (!isNaN(parseInt(dosagem, 10))) &&
            (unidade !== '')) {
            return true;
        } else {
            if (nome === '') {
                this.setState({erroNome: "Campo obrigatório!"});
            }
            if (unidade === '') {
                this.setState({erroUnit: "Campo obrigatório!"});
            }
            if (isNaN(parseInt(dosagem, 10))) {
                this.setState({erroDose: "Número inválido!"});
            }
            return false;
        }
    };

    salvar = (event) => {
        event.preventDefault();

        const nome = this.nome !== undefined ? this.nome.input.value : this.state.nome;
        const dosagem = this.dosagem !== undefined ? this.dosagem.input.value : this.state.dosagem;
        const unidade = this.unidade !== undefined ? this.unidade.input.value : this.state.unidade;

        if (!this.validar(nome, dosagem, unidade)) {
            return;
        }

        database.ref("idosos").child(this.state.key).update({
            nome: nome,
            dosagem: parseInt(dosagem, 10),
            unidade: unidade
        });
        this.setState({
            open: false
        });
    };

    render() {
        const actions = [
            <RaisedButton
                label="Cancelar"
                style={{marginRight: "5px"}}
                onTouchTap={this.handleClose}/>,
            <RaisedButton
                label="Salvar"
                primary={true}
                type="submit"
                onTouchTap={this.salvar}/>
        ];

        return (
            <div>
                <IconButton onTouchTap={this.handleTap}
                            style={{float: 'left'}}>
                    <FontIcon className="material-icons">mode_edit</FontIcon>
                </IconButton>
                <form onSubmit={this.salvar} encType="multipart/form-data">
                    <Dialog
                        title="Editar remédio"
                        actions={actions}
                        modal={true}
                        contentStyle={{width: "72vw", maxWidth: 'none'}}
                        autoScrollBodyContent={true}
                        open={this.state.open}
                    >
                        <TextField
                            className="input-field"
                            type="text" errorText={this.state.erroNome}
                            defaultValue={this.state.nome}
                            floatingLabelText="Nome" ref={(input) => this.nome = input}
                        />

                        <TextField
                            className="input-field"
                            type="number" errorText={this.state.erroDose}
                            defaultValue={this.state.dosagem}
                            floatingLabelText="Dosagem" ref={(input) => this.dosagem = input}
                        />

                        <TextField
                            className="input-field"
                            type="text" errorText={this.state.erroUnit}
                            defaultValue={this.state.unidade}
                            floatingLabelText="Unidade de dosagem" ref={(input) => this.unidade = input}
                        />

                        <TextField
                            className="input-field"
                            type="text" disabled={true}
                            defaultValue={this.state.foto}
                            floatingLabelText="Foto"
                        />
                    </Dialog>
                </form>
            </div>
        );
    }
}
