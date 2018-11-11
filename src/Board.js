import React from 'react';

import Word from './Word';
import NameForm from './NameForm';
import Label from './Label';
import Countdown from './Countdown';

class Board extends React.Component {
    rounds = [
        "Első kör nincs passz, akárhány tipp, mindent lehet, kivéve kimondani a keresett szót",
        "Második körtől végig van passz, de csak egy tipp van, ha félre, akkor megy az aljára. Második körben max egy szó, mutogatás, hangutánzás bármennyi és mutogatás",
        "Harmadik kör csak mutogatás",
        "Negyedik kör egy póz",
    ];

    constructor(props) {
        super(props);
        this.state = {
            labels: [],
            guessedLabels: [],
            round: 1,
            setup: true,
            guessing: false,
        }
        this.addLabel = this.addLabel.bind(this);
        this.checkProgression = this.checkProgression.bind(this);
        this.startGame = this.startGame.bind(this);
        this.progressRound = this.progressRound.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.guessTop = this.guessTop.bind(this);
        this.passTop = this.passTop.bind(this);
        this.startGuessing = this.startGuessing.bind(this);
        this.stopGuessing = this.stopGuessing.bind(this);
    }

    addLabel(name) {
        if (name !== "" && this.state.labels.indexOf(name) === -1) { // TODO duplicate check
            const labels = this.state.labels.slice();
            labels.push(new Word(name, false));
            this.setState({ labels: labels });
        }
    }

    checkProgression() {
        console.log(this.state.labels.length);
        if (this.state.labels.length === 0) {
            this.progressRound();
            const labels = this.state.labels.slice();
            const guessedLabels = this.state.guessedLabels.slice();
            this.setState({ labels: guessedLabels, guessedLabels: labels }, this.shuffle);
        }
    }

    startGame() {
        if (this.state.labels.length !== 0) {
            this.setState({ setup: false });
        }
    }

    progressRound() {
        let round = this.state.round + 1;
        this.setState({ round: round });
    }

    shuffle() {
        const labels = this.state.labels.slice();
        for (let i = labels.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = labels[i];
            labels[i] = labels[j];
            labels[j] = temp;
        }
        this.setState({ labels: labels });
    }

    guessTop() {
        const labels = this.state.labels.slice();
        const guessedLabels = this.state.guessedLabels.slice();
        const first = labels.shift();
        first.guessed = true;
        guessedLabels.push(first);
        this.setState({ labels: labels, guessedLabels: guessedLabels }, this.checkProgression);
    }

    passTop() {
        const labels = this.state.labels.slice();
        const first = labels.shift();
        labels.push(first);
        this.setState({ labels: labels });
    }

    startGuessing() {
        this.setState({ guessing: true });
    }

    stopGuessing() {
        this.passTop();
        this.setState({ guessing: false });
    }

    render() {
        let words = <ul>{this.state.labels.map((element, index) => <Label key={element.name} word={element} />)}</ul>;

        if (this.state.setup) {
            let controls = <div><NameForm callback={this.addLabel} /><input type="button" value="Start" onClick={this.startGame} /></div>;

            return (
                <div>
                    {controls}
                    {words}
                </div>
            );
        } else {
            let controls = <div><input type="button" value="Guessed" onClick={this.guessTop} /><input type="button" value="Pass" onClick={this.passTop} /></div>;
            let instructions = <div className="instructions">{this.state.round > 0 && this.rounds[this.state.round - 1]}</div>;
            let countdown = <Countdown seconds="30" startCallback={this.startGuessing} endCallback={this.stopGuessing} />;
            let guessedWords = <ul>{this.state.guessedLabels.map((element, index) => <Label key={element.name} word={element} />)}</ul>;

            return (
                <div>
                    {this.state.guessing && controls}
                    {instructions}
                    {countdown}
                    {words}
                    {guessedWords}
                </div>
            );
        }
    }
}

export default Board;
