import React, {Component} from 'react';
import {Card, CardMedia, CardTitle, CardText, CardActions, RaisedButton} from 'material-ui';
import {database} from '../../utils/auth';
import {browserHistory} from 'react-router';

export default class CardIdoso extends Component {

    constructor(props) {
        super(props);
        this.state = {idoso: {}, key: ''};
    }

    componentWillMount() {
        database.ref("idosos")
            .child(this.props.chave)
            .on("value", snap => {
                this.setState({idoso: snap.toJSON(), key: snap.key});
            });
    }

    abreResumo = () => {
        browserHistory.push({pathname: "/leituras", state: {elder: this.state.key}});
    };

    renderMeds = () => {
        return this.state.idoso.remediosidoso === undefined ?
            'Nenhum medicamento cadastrado'
            : Object.values(this.state.idoso.remediosidoso).map(item => {
                return item.nome;
            }).join(', ');
    };

    render() {
        return (
            <Card style={{
                width: '20vw',
                padding: '1vw',
                margin: '1vw',
                overflow: 'auto',
                display: 'block',
                float: 'left'
            }}>
                <CardMedia overlay={<CardTitle title={this.state.idoso.nome}
                                               subtitle={"Idade: " + this.state.idoso.idade +
                                               " | Peso: " + this.state.idoso.peso}/>}>
                    <img src={this.state.idoso.foto} alt=""/>
                </CardMedia>
                <CardText>
                    Altura: {this.state.idoso.altura} <br/>
                    Remédios: {this.renderMeds()} <br/>
                    Acesse um resumo das informações clicando no botão abaixo.
                </CardText>
                <CardActions>
                    <RaisedButton onTouchTap={this.abreResumo} label="Detalhes" primary={true}/>
                </CardActions>
            </Card>
        );
    }

}