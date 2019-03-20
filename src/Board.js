import React from 'react';

import Word from './Word';
import NameForm from './NameForm';
import List from './List';
import Countdown from './Countdown';
import './index.css';

class Board extends React.Component {
    rounds = [
        <ul><li>You can talk or act as much as you want</li><li>You can not say the given word</li><li>The guessing player has unlimited guesses, but you cannot move on if they did not guess correctly</li></ul>,
        <ul><li>From now on either you or the guessing player are allowed to pass, and move on to the next word</li><li>You can only say a single word</li><li>You can act</li><li>You can imitate sounds</li></ul>,
        <ul><li>You can only act</li></ul>,
        <ul><li>You can only do a single pose</li><li>The guessing player must cover his eyes while you're setting up; say a given word ("go!") when you have settled into the pose</li></ul>,
    ];

    constructor(props) {
        super(props);

        let localStorageExists = typeof (Storage) !== 'undefined';

        if (localStorageExists && localStorage.savedState) {
            this.state = JSON.parse(localStorage.savedState);
        } else {
            this.state = {
                labels: [],
                guessedLabels: [],
                round: 1,
                setup: true,
                guessing: false,
            };
        }

        this.resetGame = this.resetGame.bind(this);
        this.labelsContains = this.labelsContains.bind(this);
        this.addLabel = this.addLabel.bind(this);
        this.removeLabel = this.removeLabel.bind(this);
        this.checkProgression = this.checkProgression.bind(this);
        this.startGame = this.startGame.bind(this);
        this.progressRound = this.progressRound.bind(this);
        this.shuffle = this.shuffle.bind(this);
        this.guessTop = this.guessTop.bind(this);
        this.passTop = this.passTop.bind(this);
        this.startGuessing = this.startGuessing.bind(this);
        this.stopGuessing = this.stopGuessing.bind(this);
        this.saveState = this.saveState.bind(this);
    }

    saveState() {
        // make a deep copy of the state
        let copy = JSON.parse(JSON.stringify(this.state));
        copy.guessing = false;
        localStorage.savedState = JSON.stringify(copy);
    }

    resetGame() {
        let copy = this.state.guessedLabels.slice().concat(this.state.labels.slice());
        copy.forEach((word) => word.guessed = false);
        this.setState({
            labels: copy,
            guessedLabels: [],
            round: 1,
            setup: true,
            guessing: false,
        }, this.saveState);
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
            this.setState({ labels: labels }, this.saveState);
        }
    }

    removeLabel(index) {
        let copy = this.state.labels.slice();
        copy.splice(index, 1);
        this.setState({ labels: copy }, this.saveState);
    }

    checkProgression() {
        if (this.state.labels.length === 0) {
            if (this.state.round === 4) {
                this.resetGame();
            } else {
                this.stopGuessing();
                this.progressRound();
                const guessedLabels = this.state.guessedLabels.slice();
                guessedLabels.forEach((word) => { word.guessed = false; });
                this.setState({ labels: guessedLabels, guessedLabels: [] }, this.shuffle);
            }
        } else {
            this.saveState();
        }
    }

    startGame() {
        if (this.state.labels.length !== 0) {
            this.setState({ setup: false }, this.shuffle);
        }
    }

    progressRound() {
        let round = this.state.round + 1;
        this.setState({ round: round }, this.saveState);
    }

    shuffle() {
        const labels = this.state.labels.slice();
        for (let i = labels.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = labels[i];
            labels[i] = labels[j];
            labels[j] = temp;
        }
        this.setState({ labels: labels }, this.saveState);
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
        this.setState({ labels: labels }, this.saveState);
    }

    startGuessing() {
        this.setState({ guessing: true }, this.saveState);
    }

    stopGuessing() {
        this.passTop();
        this.setState({ guessing: false }, this.saveState);
    }

    render() {
        let words = <List words={this.state.labels} setup={this.state.setup} guessing={this.state.guessing} remove={this.removeLabel} />;

        if (this.state.setup) {
            return (
                <div className="container">
                    <div className="row p-2">
                        <div className="col">
                            <h1>Add your list of words</h1>
                            <NameForm callback={this.addLabel} />
                            <button type="button" className="btn btn-primary" onClick={this.startGame}>Start Game</button>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col">
                            {words}
                        </div>
                    </div>
                </div>
            );
        } else {
            let pass = this.state.round !== 1 && <button className="btn btn-info m-1" type="button" onClick={this.passTop}>Passed</button>;
            let controls = <div><button className="btn btn-success" type="button" onClick={this.guessTop}>Guessed</button>{pass}</div>;
            let countdown = <Countdown seconds="30" startCallback={this.startGuessing} endCallback={this.stopGuessing} key={this.state.round} />;
            let guessedWords = <List words={this.state.guessedLabels} setup={this.state.setup} guessing={this.state.guessing} />;

            return (
                <div className="container">
                    <div className="row p-2">
                        <div className="col">
                            <div class="alert alert-info" role="alert">
                                <h4 class="alert-heading">Round {this.state.round}</h4>
                                <p>{this.rounds[this.state.round - 1]}</p>
                            </div>
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col">
                            {this.state.guessing && controls}
                            {countdown}
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col">
                            {words}
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col">
                            {guessedWords}
                        </div>
                    </div>
                    <div className="row p-2">
                        <div className="col">
                            <button className="btn btn-danger" onClick={this.resetGame}>Reset game</button>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default Board;
