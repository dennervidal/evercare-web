import React, {Component} from 'react';
import '../../css/registro.css';
import {
    TextField,
    RaisedButton,
    Paper
} from 'material-ui';
import {database, auth} from "../../utils/auth.js";
import {browserHistory} from 'react-router';


export default class CriarRemedio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            erroNome: '',
            erroDose: '',
            erroFoto: '',
            erroUnidade: '',
            erroBarcode: ''
        };
    }

    validaCampos() {
        if (this.nome.input.value && this.unidade.input.value && this.barcode.input.value &&
            this.foto.input.value && this.dosagem.input.value) {
            return true;
        } else {
            if (!this.nome.input.value) {
                this.setState({erroNome: "Campo obrigatório!"});
            }
            if (!this.unidade.input.value) {
                this.setState({erroUnidade: "Campo obrigatório!"});
            }
            if (!this.foto.input.value) {
                this.setState({erroEndereco: "Campo obrigatório!"});
            }
            if (this.dosagem.input.value) {
                this.setState({erroDose: "Campo obrigatório!"});
            }
            if (this.barcode.input.value) {
                this.setState({erroBarcode: "Campo obrigatório!"});
            }
            return false;
        }
    }

    envia(event) {
        event.preventDefault();
        if (!this.validaCampos()) {
            return;
        }

        const nome = this.nome.input.value;
        const foto = this.foto.input.value;
        const dose = this.dosagem.input.value;
        const unidade = this.unidade.input.value;
        const barcode = this.barcode.input.value;

        database.ref("usuarios").child(auth.currentUser.uid).child("remedios").child(barcode).set({
            nome: nome,
            foto: foto,
            dosagem: parseInt(dose, 10),
            unidade: unidade
        });
        browserHistory.push("/remedios");
    }

    render() {
        return (
            <Paper zDepth={1} className="paper-full">

                <span>{this.state.msg}</span>

                <form onSubmit={this.envia.bind(this)} encType="multipart/form-data">
                    <TextField className="input-field" type="text" floatingLabelText="Código de barras"
                               ref={(input) => this.barcode = input}
                               onChange={() => this.setState({erroBarcode: ''})}
                               hintText="Insira o código de barras do medicamento"
                               errorText={this.state.erroBarcode}/>
                    <TextField className="input-field" type="text" floatingLabelText="Nome do medicamento"
                               ref={(input) => this.nome = input}
                               onChange={() => this.setState({erroNome: ''})}
                               errorText={this.state.erroNome}/>
                    <TextField className="input-field" type="number" floatingLabelText="Dosagem"
                               ref={(input) => this.dosagem = input}
                               onChange={() => this.setState({erroDose: ''})}
                               errorText={this.state.erroDose}/>
                    <TextField className="input-field" type="text" floatingLabelText="Unidade de dosagem"
                               ref={(input) => this.unidade = input}
                               onChange={() => this.setState({erroUnidade: ''})}
                               errorText={this.state.erroUnidade}/>
                    <TextField className="input-field" type="text" floatingLabelText="URL da foto"
                               ref={(input) => this.foto = input}
                               onChange={() => this.setState({erroFoto: ''})}
                               errorText={this.state.erroFoto}/>

                    <RaisedButton className="button-submit" primary={true} type="submit" label="Registrar"/>
                </form>
            </Paper>
        );
    }
}
