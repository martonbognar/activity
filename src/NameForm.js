import React from 'react';

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
                    New word:&nbsp;
                    <input type="text" value={this.state.value} onChange={this.handleChange} autoFocus />
                </label>
                <input type="submit" value="Add" />
            </form>
        );
    }
}

export default NameForm;
