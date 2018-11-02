import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Label extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      guessed: false,
    }
  }

  render() {
    return (
      <li>
        {this.state.name}
      </li>
    )
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

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      labels: ['hello', 'world'],
      setup: true,
    }
    this.addLabel = this.addLabel.bind(this);
    this.startGame = this.startGame.bind(this);
  }

  addLabel(name) {
    if (this.state.labels.indexOf(name) == -1) {
      const labels = this.state.labels.slice();
      labels.push(name);
      this.setState({ labels: labels });
    }
  }

  startGame() {
    this.setState({setup: false});
  }

  render() {
    return (
      <div>
        {this.state.setup && <div><NameForm callback={this.addLabel} /><input type="button" value="Start" onClick={this.startGame} /></div>}
        <ul>
          {this.state.labels.map((element, index) => <Label key={element} name={element} />)}
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
