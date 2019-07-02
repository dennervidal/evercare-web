import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog';
import {RaisedButton, AutoComplete, TextField, MenuItem, SelectField, DatePicker} from 'material-ui';
import {database} from "../../utils/auth";

export default class AdicionarRemedio extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            searchText: '',
            searchKey: '',
            medError: '',
            dataInit: new Date(),
            erroFreq: '',
            erroQtd: '',
            addNew: false,
            status: "ativo",
        };
        this.medSett = {
            text: 'value',
            value: 'key'
        };
    }

    handleMenu = (event, index, value) => {
        this.setState({status: value});
    };


    handleUpdateInput = (searchText) => {
        this.setState({
            searchText: searchText
        });
    };

    handleSelectedComplete = (req) => {
        this.setState({
            searchKey: req.key,
            addNew: true
        });
    };

    handleOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false, addNew: false, searchText: ''});
    };

    validar(freq, qtd) {
        if ((freq !== '') && (!isNaN(parseInt(qtd, 10)))) {
            return true;
        } else {
            if (freq === '') {
                this.setState({erroFreq: "Campo obrigatório!"});
            }
            if (qtd === '') {
                this.setState({erroQtd: "Campo obrigatório!"});
            }
            if (isNaN(parseInt(qtd, 10))) {
                this.setState({erroQtd: "Número inválido!"});
            }
            return false;
        }
    }

    salvar = () => {
        const nome = this.state.searchText;
        const freq = this.freq.input.value;
        const dtInit = this.state.dataInit.toLocaleDateString();
        const qtd = this.qtd.input.value;

        if (!this.validar(freq, qtd)) {
            return;
        }

        database.ref("idosos")
            .child(this.props.idIdoso)
            .child("remediosidoso")
            .child(this.state.searchKey)
            .update({
                nome: nome,
                frequencia: freq,
                dataini: dtInit,
                quantidade: parseInt(qtd, 10),
                status: this.state.status
            });
        this.handleClose();
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.msg !== nextProps.msg) {
            this.setState({open: true});
        }
    }

    handleDate = (event, date) => {
        this.setState({
            dataInit: date,
        });
    };

    render() {
        return (
            <div>
                <div style={{width: '100%', display: 'inline-block'}}>
                    <AutoComplete
                        searchText={this.state.searchText}
                        onUpdateInput={this.handleUpdateInput}
                        onNewRequest={this.handleSelectedComplete}
                        dataSource={this.props.medSource}
                        dataSourceConfig={this.medSett}
                        floatingLabelText="Digite o nome"
                        openOnFocus={true}
                        filter={AutoComplete.caseInsensitiveFilter}
                        style={{paddingTop: 0}}
                        menuProps={{maxHeight: 350}}
                        errorText={this.state.medError}/>
                    <RaisedButton
                        label="Adicionar"
                        disabled={!this.state.addNew}
                        labelStyle={{
                            paddingTop: '0.8em',
                            overflow: "hidden",
                            textOverflow: 'ellipsis',
                            display: 'block',
                            lineHeight: '100%'
                        }}
                        primary={true}
                        onTouchTap={this.handleOpen}/>
                </div>
                <div>
                    <Dialog
                        title="Adicionar remédio"
                        actions={[
                            <RaisedButton
                                label="Cancelar"
                                style={{marginRight: '5px'}}
                                onTouchTap={this.handleClose}
                            />,
                            <RaisedButton
                                label="Salvar"
                                primary={true}
                                onTouchTap={this.salvar}
                            />]}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={this.handleClose}
                    >
                        <DatePicker container="inline"
                                    floatingLabelText="Data de início"
                                    value={this.state.dataInit}
                                    onChange={this.handleDate}
                                    formatDate={new Intl.DateTimeFormat('pt-BR').format}/>
                        <TextField className="input-field" type="text"
                                   floatingLabelText="Nome"
                                   disabled={true}
                                   value={this.state.searchText}/>
                        <TextField className="input-field" type="text" floatingLabelText="Frequência"
                                   ref={(input) => this.freq = input}
                                   onChange={() => this.setState({erroFreq: ''})}
                                   errorText={this.state.erroFreq}/>
                        <TextField className="input-field" type="number" floatingLabelText="Quantidade"
                                   ref={(input) => this.qtd = input}
                                   onChange={() => this.setState({erroQtd: ''})}
                                   errorText={this.state.erroQtd}/>
                        <SelectField floatingLabelText="Status"
                                     value={this.state.status}
                                     onChange={this.handleMenu}
                                     style={{width: "100%"}}>
                            <MenuItem value="ativo" primaryText="Ativo"/>
                            <MenuItem value="inativo" primaryText="Inativo"/>
                        </SelectField>
                    </Dialog>
                </div>
            </div>
        );
    }
}