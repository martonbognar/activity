import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Word {
  constructor(name, guessed) {
    this.name = name;
    this.guessed = guessed;
  }
}

class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      word: props.word,
    }
  }

  render() {
    if (!this.state.word.guessed) {
      return (
        <li>
          {this.state.word.name}
        </li>
      )
    } else {
      return (
        <li>
          <del>{this.state.word.name}</del>
        </li>
      )
    }
  }
}

class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '', callback: props.callback };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.state.callback(this.state.value);
    this.setState({ value: '' });
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class Countdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seconds: props.seconds,
      callback: props.callback,
    }

    this.decreaseTime = this.decreaseTime.bind(this);
  }

  decreaseTime() {
    if (this.state.seconds !== 0) {
      let seconds = this.state.seconds - 1;
      this.setState({ seconds: seconds });
      setTimeout(this.decreaseTime, 1000);
    } else {
      this.state.callback();
    }
  }

  render() {
    return (
      <div>
        {this.state.seconds} seconds remainig.
        <input type="submit" value="Start" onClick={this.decreaseTime} />
      </div>
    );
  }
}

class Board extends React.Component {
  rounds = ["Első kör nincs passz, akárhány tipp, mindent lehet, kivéve kimondani a keresett szót",
    "Második körtől végig van passz, de csak egy tipp van, ha félre, akkor megy az aljára. Második körben max egy szó, mutogatás, hangutánzás bármennyi és mutogatás",
    "Harmadik kör csak mutogatás",
    "Negyedik kör egy póz"];

  constructor(props) {
    super(props);
    this.state = {
      labels: [],
      guessedLabels: [],
      round: 0,
    }
    this.addLabel = this.addLabel.bind(this);
    this.checkProgression = this.checkProgression.bind(this);
    this.progressRound = this.progressRound.bind(this);
    this.guessTop = this.guessTop.bind(this);
    this.passTop = this.passTop.bind(this);
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
      this.setState({ labels: guessedLabels, guessedLabels: labels });
    }
  }

  progressRound() {
    let round = this.state.round + 1;
    this.setState({ round: round });
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

  render() {
    let controls;
    if (this.state.round === 0) {
      controls = <div><NameForm callback={this.addLabel} /><input type="button" value="Start" onClick={this.progressRound} /></div>;
    } else {
      controls = <div><input type="button" value="Guessed" onClick={this.guessTop} /><input type="button" value="Pass" onClick={this.passTop} /></div>
    }

    return (
      <div>
        {controls}
        <div className="instructions">
          {this.state.round > 0 && this.rounds[this.state.round - 1]}
        </div>
        <Countdown seconds="30" callback={this.passTop} />
        <ul>
          {this.state.labels.map((element, index) => <Label key={element.name} word={element} />)}
        </ul>
        <ul>
          {this.state.guessedLabels.map((element, index) => <Label key={element.name} word={element} />)}
        </ul>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
