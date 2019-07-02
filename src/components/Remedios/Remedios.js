import React, {Component} from 'react';
import {
    Card,
    CardText,
    CardActions,
    RaisedButton,
    Toolbar,
    ToolbarGroup
} from 'material-ui';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn
} from 'material-ui/Table';
import ReactFireMixin from "reactfire";
import reactMixin from 'react-mixin';
import {database, auth} from "../../utils/auth";
import {Link} from 'react-router';
import {DeleteButton} from '../Alert';
import EditarRemedio from './EditarRemedio';

class ListaRemedios extends Component {

    removerMed = chave => {
        const ref = database.ref("usuarios").child(auth.currentUser.uid).child("remedios").child(chave);
        ref.remove().then(() => {
            console.log("Medicamento removido");
        });
    };

    render() {
        const remedios = this.props.data.map((remedio, index) => {
            return (
                <TableRow key={index}>
                    <TableRowColumn style={{textAlign: 'center'}}>{remedio.nome}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{remedio.dosagem}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{remedio.unidade}</TableRowColumn>
                    <TableRowColumn style={{display: 'flex', justifyContent: 'center'}}>
                        <EditarRemedio chave={remedio[".key"]}/>
                        <DeleteButton chave={remedio[".key"]} msg="Deseja remover este medicamento?"
                                      cb={this.removerMed}/>
                    </TableRowColumn>
                </TableRow>
            );
        });
        return (
            <Table multiSelectable={false} selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Nome do medicamento</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Dosagem</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Unidade de dosagem</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Ações</b></TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {remedios}
                </TableBody>
            </Table>
        );
    }
}

class Remedios extends Component {

    constructor() {
        super();
        this.state = {data: []};
    }

    componentWillMount() {
        this.bindAsArray(database.ref("usuarios").child(auth.currentUser.uid).child("remedios"), 'data', error => {
            console.log(error);
        });
    }

    render() {
        return (
            <Card>
                <CardActions>
                    <Toolbar style={{borderRadius: "5px"}}>
                        <ToolbarGroup style={{marginBottom: "0.2vw"}}>
                            <RaisedButton
                                containerElement={<Link to={"/remedios/criar"}/>}
                                className="button-submit"
                                primary={true} label="Registrar"/>
                        </ToolbarGroup>
                    </Toolbar>
                </CardActions>
                <CardText>
                    <ListaRemedios data={this.state.data}/>
                </CardText>
            </Card>
        );
    }
}

reactMixin(Remedios.prototype, ReactFireMixin);

export default Remedios;
