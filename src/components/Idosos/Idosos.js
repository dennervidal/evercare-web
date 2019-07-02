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
import {database} from "../../utils/auth";
import {Link} from 'react-router';
import {DeleteButton} from '../Alert';
import EditarIdoso from './EditarIdoso';

class ListaIdosos extends Component {

    removerIdoso = chave => {
        const ref = database.ref("idosos").child(chave);
        ref.remove().then(() => {
            console.log("Idoso removido");
        });
    };

    render() {
        const idosos = this.props.data.map((idoso, index) => {
            return (
                <TableRow key={index}>
                    <TableRowColumn style={{textAlign: 'center'}}>{idoso.nome}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{idoso.idade}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{idoso.peso}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{idoso.altura}</TableRowColumn>
                    <TableRowColumn style={{textAlign: 'center'}}>{idoso.sexo}</TableRowColumn>
                    <TableRowColumn style={{display: 'flex', justifyContent: 'center'}}>
                        <EditarIdoso firebaseKey={idoso[".key"]}/>
                        <DeleteButton chave={idoso[".key"]} msg="Deseja remover este idoso?"
                                      cb={this.removerIdoso}/>
                    </TableRowColumn>
                </TableRow>
            );
        });
        return (
            <Table multiSelectable={false} selectable={false}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Nome</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Idade (anos)</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Peso (kg)</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Altura (m)</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Gênero</b></TableHeaderColumn>
                        <TableHeaderColumn style={{textAlign: 'center'}}><b>Ações</b></TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {idosos}
                </TableBody>
            </Table>
        );
    }
}

class Idosos extends Component {

    constructor() {
        super();
        this.state = {data: []};
    }

    componentWillMount() {
        this.bindAsArray(database.ref("idosos"), 'data', error => {
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
                                containerElement={<Link to={"/idosos/criar"}/>}
                                className="button-submit"
                                primary={true} label="Registrar"/>
                        </ToolbarGroup>
                    </Toolbar>
                </CardActions>
                <CardText>
                    <ListaIdosos data={this.state.data}/>
                </CardText>
            </Card>
        );
    }
}

reactMixin(Idosos.prototype, ReactFireMixin);

export default Idosos;
