import React from 'react';

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

export default Label;
