import React, {Component} from 'react';
import {
    Card,
    CardText,
    CardActions,
    MenuItem,
    Toolbar,
    ToolbarGroup,
    SelectField
} from 'material-ui';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import {database} from "../../utils/auth";

class ListaLeituras extends Component {

    render() {
        const leituras = this.props.data.map((leitura, index) => {
            return (
                <TableRow key={index}>
                    <TableRowColumn style={{textAlign: 'center'}}>{leitura.data}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{leitura.tipo}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{leitura.valor}</TableRowColumn>
                </TableRow>
            );
        });
        return (
            <Table multiSelectable={false} selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Data</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Tipo</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Valor</b></TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {leituras}
                </TableBody>
            </Table>
        );
    }
}

class Leituras extends Component {

    constructor() {
        super();
        this.state = {data: [], idosos: {}, elder: '', type: 'batimento'};
    }

    componentWillMount() {
        database.ref("idosos").once("value").then(snap => {
            this.setState({idosos: snap.toJSON()});
        });
        if (this.props.location.state && this.props.location.state.elder) {
            this.handleMenu(undefined, undefined, this.props.location.state.elder);
        }

    }

    loadData = snap => {
        let data = [];
        snap.forEach(item => {
            const read = item.val();
            if (this.state.type === "pressao") {
                data.push({
                    valor: read.valors + '/' + read.valord,
                    tipo: this.state.type,
                    data: item.key
                });
            } else if (this.state.type === "local") {
                data.push({
                    valor: read.valor1 + ', ' + read.valor2,
                    tipo: this.state.type,
                    data: item.key
                });
            } else if (this.state.type === "queda") {
                data.push({
                    valor: read.valor ? 'queda registrada' : '',
                    tipo: this.state.type,
                    data: item.key
                });
            } else {
                data.push({
                    valor: read.valor,
                    tipo: this.state.type,
                    data: item.key
                });
            }
        });
        this.setState({data: data});
    };

    handleMenu = (e, index, v) => {
        this.setState(() => ({elder: v}),
            () => {
                database.ref("idosos").child(v).child("leituras").child(this.state.type).on("value", this.loadData);
            });
    };

    handleType = (e, index, v) => {
        this.setState(() => ({type: v}),
            () => {
                database.ref("idosos").child(this.state.elder).child("leituras").child(v).on("value", this.loadData);
            });
    };

    render() {
        const elders = Object.keys(this.state.idosos).map((elder, index) => {
            return (
                <MenuItem key={index} value={elder} primaryText={Object.values(this.state.idosos)[index].nome}/>
            );
        });
        return (
            <Card>
                <CardActions>
                    <Toolbar style={{borderRadius: "5px"}}>
                        <ToolbarGroup>
                            <SelectField floatingLabelText="Idoso para exibir"
                                         value={this.state.elder}
                                         onChange={this.handleMenu}
                                         style={{marginBottom: '1.6vh'}}
                            >
                                {elders}
                            </SelectField>
                        </ToolbarGroup>
                        <ToolbarGroup>
                            <SelectField floatingLabelText="Escolha o sinal biologico"
                                         value={this.state.type}
                                         onChange={this.handleType}
                                         style={{marginBottom: '1.6vh'}}
                            >
                                <MenuItem value="batimento" primaryText="Batimento"/>
                                <MenuItem value="pressao" primaryText="Pressão"/>
                                <MenuItem value="temperatura" primaryText="Temperatura"/>
                                <MenuItem value="local" primaryText="Localização"/>
                                <MenuItem value="queda" primaryText="Quedas"/>
                                <MenuItem value="passo" primaryText="Passos"/>
                            </SelectField>
                        </ToolbarGroup>
                    </Toolbar>
                </CardActions>
                <CardText>
                    <ListaLeituras data={this.state.data}/>
                </CardText>
            </Card>
        );
    }
}

export default Leituras;
