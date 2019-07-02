import React, {Component} from 'react';
import '../../css/registro.css';
import {
    TextField,
    RaisedButton,
    IconButton,
    FontIcon,
    Dialog,
    LinearProgress,
    SelectField,
    MenuItem, Card, CardTitle, CardText
} from 'material-ui';
import {database, storage, auth} from "../../utils/auth.js";
import Alert from "../Alert";
import AdicionarRemedio from './AdicionarRemedio';
import MedChip from '../Remedios/MedChip';

export default class EditarIdoso extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            infoIdoso: {},
            sexo: '',
            foto: '',
            msg: '',
            progress: '',
            erroNome: '',
            erroImg: '',
            erroPeso: '',
            erroDev: '',
            erroAge: '',
            erroAlt: '',
            validExt: false,
            medSource: [],
            key: ''
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
        const ref = database.ref("idosos").child(key);
        ref.on("value", data => {
            const user = data.val();
            this.setState({
                key: key,
                infoIdoso: user,
                sexo: user.sexo,
                validExt: true,
                foto: user.foto
            });
        });
    }

    componentWillMount() {
        this.carregaPopover(this.props.firebaseKey);
        let data = [];
        database.ref("usuarios")
            .child(auth.currentUser.uid)
            .child("remedios")
            .once("value").then(snap => {
            snap.forEach(item => {
                data.push({
                    key: item.key,
                    value: item.child("nome").val(),
                    photo: item.child("foto").val()
                });
            });
            this.setState({medSource: data});
        });

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.firebaseKey !== this.props.firebaseKey) {
            this.carregaPopover(nextProps.firebaseKey);
        }
    }

    validar = (nome, idade, peso, dev, altura) => {
        if ((nome !== '') &&
            (!isNaN(parseInt(idade, 10))) &&
            (!isNaN(parseFloat(peso))) &&
            (dev !== '') &&
            (!isNaN(parseInt(altura, 10))) &&
            this.state.validExt) {
            return true;
        } else {
            if (!this.state.validExt) {
                this.setState({erroImg: "Imagem inválida!"});
            }
            if (nome === '') {
                this.setState({erroNome: "Campo obrigatório!"});
            }
            if (dev === '') {
                this.setState({erroDev: "Campo obrigatório!"});
            }
            if (isNaN(parseInt(idade, 10))) {
                this.setState({erroAge: "Número inválido!"});
            }
            if (isNaN(parseFloat(peso))) {
                this.setState({erroPeso: "Número inválido!"});
            }
            if (isNaN(parseInt(altura, 10))) {
                this.setState({erroAlt: "Número inválido!"});
            }
            return false;
        }
    };

    salvar = (event) => {
        event.preventDefault();

        const nome = this.nome !== undefined ? this.nome.input.value : this.state.infoIdoso.nome;
        const idade = this.idade !== undefined ? this.idade.input.value : this.state.infoIdoso.idade;
        const peso = this.peso !== undefined ? this.peso.input.value : this.state.infoIdoso.peso;
        const dev = this.dev !== undefined ? this.dev.input.value : this.state.infoIdoso.dispositivo;
        const altura = this.altura !== undefined ? this.altura.input.value : this.state.infoIdoso.altura;

        if (!this.validar(nome, idade, peso, dev, altura)) {
            return;
        }

        this.setState({progress: <LinearProgress mode="indeterminate"/>});

        if (this.fotoBlob.files[0]) {
            storage.ref("imgIdosos")
                .child(this.state.key)
                .child("profile").put(this.fotoBlob.files[0])
                .then(data => {
                    database.ref("idosos").child(this.state.key).update({
                        foto: data.downloadURL
                    });
                    this.setState({
                        foto: data.downloadURL,
                    });
                })
                .catch(error => {
                    this.setState({msg: error.message});
                    console.log(error.code);
                });
        }

        database.ref("idosos").child(this.state.key).update({
            nome: nome,
            genero: this.state.sexo,
            idade: parseInt(idade, 10),
            peso: peso,
            altura: altura,
            dispositivo: dev
        });
        this.setState({
            open: false,
            progress: ''
        });
    };

    handleChange = (event) => {
        const path = event.target.value.split('\\');
        const regex = new RegExp("(.*?).(jpg|jpeg|png|bmp|gif)$");
        this.setState({
            foto: path[path.length - 1],
            erroImg: '',
            validExt: regex.test(path)
        });
    };

    handleMenu = (event, index, value) => {
        this.setState({sexo: value});
    };

    delMed = (medId) => {
        database.ref("idosos")
            .child(this.state.key)
            .child("remediosidoso")
            .child(medId)
            .remove()
            .then(() => console.log("Remédio removido"));
    };

    viewMed = (medId) => {
        const i = Object.keys(this.state.infoIdoso.remediosidoso).findIndex(item => item === medId);
        const values = Object.values(this.state.infoIdoso.remediosidoso)[i];
        this.setState({
            msg:
                `Medicamento ${values.nome} iniciado no dia ${values.dataini}, indicado uso de ${values.frequencia} ao dia.`
        });
    };

    renderMeds() {
        if (this.state.infoIdoso.remediosidoso) {
            return Object.values(this.state.infoIdoso.remediosidoso).map((med, index) => {
                return (
                    <MedChip key={index}
                             nome={med.nome}
                             medId={Object.keys(this.state.infoIdoso.remediosidoso)[index]}
                             foto={this.state.medSource.find(item => item.value === med.nome ? item.photo : false)}
                             cb={this.delMed}
                             tap={this.viewMed}
                    />
                );
            });
        } else {
            return "Nenhum medicamento cadastrado!";
        }
    }

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
        const remedios = this.renderMeds();

        return (
            <div>
                <IconButton onTouchTap={this.handleTap}
                            style={{float: 'left'}}>
                    <FontIcon className="material-icons">mode_edit</FontIcon>
                </IconButton>
                <form onSubmit={this.salvar} encType="multipart/form-data">
                    <Dialog
                        title="Editar idoso"
                        actions={actions}
                        modal={true}
                        contentStyle={{width: "72vw", maxWidth: 'none'}}
                        autoScrollBodyContent={true}
                        open={this.state.open}
                    >
                        <div style={{float: 'left', width: '49%'}}>
                            <TextField
                                className="input-field"
                                type="text" errorText={this.state.erroNome}
                                defaultValue={this.state.infoIdoso.nome}
                                floatingLabelText="Nome" ref={(input) => this.nome = input}
                            />

                            <TextField
                                className="input-field"
                                type="text" errorText={this.state.erroDev}
                                defaultValue={this.state.infoIdoso.dispositivo}
                                floatingLabelText="Dispositivo" ref={(input) => this.dev = input}
                            />

                            <SelectField floatingLabelText="Gênero"
                                         value={this.state.sexo}
                                         onChange={this.handleMenu}
                                         style={{width: "100%"}}>
                                <MenuItem value="Feminino" primaryText="Feminino"/>
                                <MenuItem value="Masculino" primaryText="Masculino"/>
                            </SelectField>

                            <TextField
                                className="input-field"
                                type="text" errorText={this.state.erroAlt}
                                defaultValue={this.state.infoIdoso.altura}
                                floatingLabelText="Altura" ref={(input) => this.altura = input}
                            />

                            <TextField
                                className="input-field"
                                type="number" errorText={this.state.erroAge}
                                defaultValue={this.state.infoIdoso.idade}
                                floatingLabelText="Idade" ref={(input) => this.idade = input}
                            />

                            <TextField
                                className="input-field"
                                type="text" errorText={this.state.erroPeso}
                                defaultValue={this.state.infoIdoso.peso}
                                floatingLabelText="Peso" ref={(input) => this.peso = input}
                            />
                            {/* upload de fotos */}
                            <div style={{width: "99%", display: 'inline-block'}}>
                                <TextField disabled={true} type="text" floatingLabelText="Foto"
                                           value={this.state.foto} errorText={this.state.erroImg}
                                           style={{float: 'left', width: "70%"}}/>
                                <RaisedButton
                                    className="margin-top-upload"
                                    style={{float: 'right', width: "25%"}}
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
                            {/* fim do upload de fotos */}
                        </div>
                        <div style={{float: 'right', width: '50%'}}>
                            <Card>
                                <CardTitle title="Adicionar remédio" style={{paddingBottom: 0}}/>
                                <CardText style={{paddingTop: 0}}>
                                    <AdicionarRemedio medSource={this.state.medSource} idIdoso={this.state.key}/>
                                </CardText>

                                <CardTitle title="Remédios" style={{paddingTop: 0, paddingBottom: 0}}/>
                                <CardText style={{display: 'block', overflow: 'auto'}}>
                                    {remedios}
                                </CardText>

                            </Card>
                        </div>
                        {this.state.progress}
                    </Dialog>
                </form>
                {this.state.msg !== '' ? <Alert msg={this.state.msg}/> : this.state.msg}
            </div>
        );
    }
}
