import React, {Component} from 'react';
import {
    TextField,
    RaisedButton,
    Paper,
    SelectField,
    MenuItem,
    LinearProgress
} from 'material-ui';
import {database, storage, auth} from "../../utils/auth.js";
import "../../css/registro.css";
import {browserHistory} from 'react-router';


export default class CriarIdoso extends Component {

    constructor(props) {
        super(props);
        this.state = {
            msg: '',
            progress: '',
            erroNome: '',
            erroIdade: '',
            erroPeso: '',
            erroGen: '',
            erroDev: '',
            erroAltura: '',
            foto: '',
            erroImg: '',
            genero: '',
            validExt: false
        };
    }

    validaPeso() {
        return isNaN(parseFloat(this.peso.input.value));
    }

    validaIdade() {
        return isNaN(parseInt(this.idade.input.value, 10));
    }

    validaAltura() {
        return isNaN(parseFloat(this.altura.input.value));
    }

    validaCampos() {
        if (this.nome.input.value && !this.validaIdade() && (this.state.genero !== '' && this.dev.input.value)
            && !this.validaPeso() && this.fotoBlob.files[0] && this.state.validExt && !this.validaAltura()) {
            return true;
        } else {
            if (!this.state.validExt) {
                this.setState({erroImg: "Imagem inválida!"});
            }
            if (this.state.genero === '') {
                this.setState({erroGen: "Campo obrigatório!"});
            }
            if (!this.fotoBlob.files[0]) {
                this.setState({erroImg: "Campo obrigatório!"});
            }
            if (!this.nome.input.value) {
                this.setState({erroNome: "Campo obrigatório!"});
            }
            if (this.validaIdade()) {
                this.setState({erroIdade: "Número inválido!"});
            }
            if (!this.idade.input.value) {
                this.setState({erroIdade: "Campo obrigatório!"});
            }
            if (this.validaPeso()) {
                this.setState({erroPeso: "Número inválido!"});
            }
            if (!this.peso.input.value) {
                this.setState({erroPeso: "Campo obrigatório!"});
            }
            if (!this.dev.input.value) {
                this.setState({erroDev: "Campo obrigatório!"});
            }
            if (this.validaAltura()) {
                this.setState({erroAltura: "Número inválido!"});
            }
            if (!this.altura.input.value) {
                this.setState({erroAltura: "Campo obrigatório!"});
            }
            return false;
        }
    }

    handleChange(event) {
        const path = event.target.value.split('\\');
        const regex = new RegExp("(.*?).(jpg|jpeg|png|bmp|gif)$");
        this.setState({foto: path[path.length - 1], erroImg: '', validExt: regex.test(path)});
    }

    envia(event) {
        event.preventDefault();
        if (!this.validaCampos()) {
            return;
        }

        const nome = this.nome.input.value;
        const idade = this.idade.input.value;
        const peso = this.peso.input.value;
        const dev = this.dev.input.value;
        const altura = this.altura.input.value;

        this.setState({progress: <LinearProgress mode="indeterminate"/>});

        const novoIdoso = database.ref("idosos").push();
        database.ref("usuarios").child(auth.currentUser.uid).child("idosos").update(
            {
                [novoIdoso.key]: "ativo"
            }
        );
        storage.ref("imgIdosos")
            .child(novoIdoso.key)
            .child("profile").put(this.fotoBlob.files[0])
            .then(data => {
                novoIdoso.set({
                    nome: nome,
                    idade: parseInt(idade, 10),
                    sexo: this.state.genero,
                    peso: peso,
                    dispositivo: dev,
                    altura: altura,
                    foto: data.downloadURL
                });
                this.setState({progress: ''});
                browserHistory.push("/idosos");
            })
            .catch(error => {
                this.setState({msg: error.message});
                console.log(error.code);
            });
    }

    handleGen(event, index, value) {
        this.setState({genero: value, erroGen: ''});
    }

    render() {
        return (
            <Paper zDepth={1} className="paper-full">
                <form onSubmit={this.envia.bind(this)} encType="multipart/form-data">

                    <TextField className="input-field" type="text" floatingLabelText="Nome"
                               ref={(input) => this.nome = input}
                               onChange={() => this.setState({erroNome: ''})}
                               errorText={this.state.erroNome}/>
                    <TextField className="input-field" type="number" floatingLabelText="Idade"
                               ref={(input) => this.idade = input}
                               onChange={() => this.setState({erroIdade: ''})}
                               errorText={this.state.erroIdade}/>
                    <TextField className="input-field" type="text" floatingLabelText="Peso"
                               ref={(input) => this.peso = input}
                               onChange={() => this.setState({erroPeso: ''})}
                               errorText={this.state.erroPeso}/>
                    <TextField className="input-field" type="text" floatingLabelText="Altura"
                               ref={(input) => this.altura = input}
                               onChange={() => this.setState({erroAltura: ''})}
                               errorText={this.state.erroAltura}/>

                    <div style={{width: "99%", display: 'inline-block'}}>
                        <TextField disabled={true} type="text" floatingLabelText="Foto"
                                   value={this.state.foto} style={{float: 'left', width: "87%"}}
                                   errorText={this.state.erroImg}/>
                        <RaisedButton
                            style={{float: 'right', width: "10%"}}
                            className="margin-top-upload"
                            label="Escolher"
                            labelPosition="before"
                            containerElement="label"
                            labelStyle={{
                                paddingTop: '0.8em',
                                overflow: "hidden",
                                textOverflow: 'ellipsis',
                                display: 'block',
                                lineHeight: '100%'
                            }}>
                            <input type="file" className="image-input"
                                   onChange={this.handleChange.bind(this)}
                                   ref={(input) => this.fotoBlob = input}/>
                        </RaisedButton>
                    </div>
                    <SelectField floatingLabelText="Gênero"
                                 value={this.state.genero}
                                 onChange={this.handleGen.bind(this)}
                                 style={{width: "94vw"}}
                                 errorText={this.state.erroGen}
                    >
                        <MenuItem value="Feminino" primaryText="Feminino"/>
                        <MenuItem value="Masculino" primaryText="Masculino"/>
                    </SelectField>

                    <TextField className="input-field" type="text" floatingLabelText="Dispositivo"
                               ref={(input) => this.dev = input}
                               onChange={() => this.setState({erroDev: ''})}
                               errorText={this.state.erroDev}/>

                    {this.state.progress}
                    <RaisedButton className="button-submit" primary={true} type="submit" label="Registrar"/>
                </form>
            </Paper>
        );
    }
}
