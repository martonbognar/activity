import React from 'react';

class List extends React.Component {
    render() {
        let list = this.props.words.map((word, index) => {
            if (word.guessed) {
                return <li key={word.name}><del>{word.name}</del></li>;
            } else {
                return <li key={word.name}>{word.name}</li>;
            }
        });
        return (
            <ul>
                {list}
            </ul>
        );
    }
}

export default List;
