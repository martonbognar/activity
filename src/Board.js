import React from 'react';

import Word from './Word';
import NameForm from './NameForm';
import List from './List';
import Countdown from './Countdown';

class Board extends React.Component {
    rounds = [
        "Első kör nincs passz, akárhány tipp, mindent lehet, kivéve kimondani a keresett szót",
        "Második körtől végig van passz, de csak egy tipp van, ha félre, akkor megy az aljára. Második körben max egy szó, mutogatás, hangutánzás bármennyi és mutogatás",
        "Harmadik kör csak mutogatás",
        "Negyedik kör egy póz",
    ];

    initialState = {
        labels: [],
        guessedLabels: [],
        round: 1,
        setup: true,
        guessing: false,
    };

    constructor(props) {
        super(props);
        this.state = this.initialState;
        this.resetGame = this.resetGame.bind(this);
        this.labelsContains = this.labelsContains.bind(this);
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

    resetGame() {
        this.setState(this.initialState);
    }

    labelsContains(name) {
        let contains = false;
        this.state.labels.forEach(word => {
            if (word.name === name) {
                contains = true;
            }
        });
        return contains;
    }

    addLabel(name) {
        name = name.trim();
        if (name !== "" && !this.labelsContains(name)) {
            const labels = this.state.labels.slice();
            labels.push(new Word(name, false));
            this.setState({ labels: labels });
        }
    }

    checkProgression() {
        if (this.state.labels.length === 0) {
            if (this.state.round == 4) {
                this.resetGame();
            } else {
                this.stopGuessing();
                this.progressRound();
                const guessedLabels = this.state.guessedLabels.slice();
                guessedLabels.forEach((word) => {word.guessed = false;});
                this.setState({ labels: guessedLabels, guessedLabels: [] }, this.shuffle);
            }
        }
    }

    startGame() {
        if (this.state.labels.length !== 0) {
            this.setState({ setup: false }, this.shuffle);
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
        let words = <List words={this.state.labels} setup={this.state.setup} guessing={this.state.guessing} />;

        if (this.state.setup) {
            let controls = <div><NameForm callback={this.addLabel} /><input type="button" value="Start Game" onClick={this.startGame} /></div>;

            return (
                <div>
                    {controls}
                    {words}
                </div>
            );
        } else {
            let pass = this.state.round !== 1 && <input type="button" value="Passed" onClick={this.passTop} />;
            let controls = <div><input type="button" value="Guessed" onClick={this.guessTop} />{pass}</div>;
            let instructions = <div className="instructions">{this.state.round > 0 && this.rounds[this.state.round - 1]}</div>;
            let countdown = <Countdown seconds="30" startCallback={this.startGuessing} endCallback={this.stopGuessing} key={this.state.round} />;
            let guessedWords = <List words={this.state.guessedLabels} setup={this.state.setup} guessing={this.state.guessing} />;

            return (
                <div>
                    {instructions}
                    {countdown}
                    {this.state.guessing && controls}
                    {words}
                    {guessedWords}
                </div>
            );
        }
    }
}

export default Board;
