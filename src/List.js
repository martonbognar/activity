import React from 'react';

class List extends React.Component {
    render() {
        let list = this.props.words.map((word, index) => {
            if (this.props.setup) {
                // during setup, show all words
                return <li className="list-group-item" key={word.name}>{word.name}</li>;
            } else {
                if (word.guessed) {
                    // during the game, show all guessed words
                    return <li className="list-group-item disabled" key={word.name}>{word.name}</li>;
                } else {
                    if (this.props.guessing && index === 0) {
                        // during the game, show only the top word from the active stack
                        return <li className="list-group-item active" key={word.name}>{word.name}</li>;
                    } else {
                        return <li className="list-group-item blurry" key={word.name}>{word.name}</li>;
                    }
                }
            }
        });
        return (
            <ul className="list-group">
                {list}
            </ul>
        );
    }
}

export default List;
