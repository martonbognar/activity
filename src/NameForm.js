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
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="What should be guessed?" value={this.state.value} onChange={this.handleChange} autoFocus aria-describedby="add-button" />
                    <div className="input-group-append">
                        <button className="btn btn-outline-secondary" type="submit" id="add-button">Add</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default NameForm;
