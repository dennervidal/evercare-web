import React, {Component} from 'react';
import {database} from '../utils/auth';
import CardIdoso from './Idosos/CardIdoso';

export default class Dashboard extends Component {

    constructor(props) {
        super(props);
        this.state = {cards: []};
    }

    componentWillMount() {
        let data = [];
        database.ref("idosos")
            .on("value", snap => {
                snap.forEach(item => {
                    data.push(item.key);
                });
                this.setState({cards: data});
            });
    }

    render() {
        const cards = this.state.cards.map((card, i) => {
            return <CardIdoso chave={card} key={i}/>
        });
        return (
            <div>
                {cards}
            </div>
        );
    }

}