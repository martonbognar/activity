import React from 'react';

class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: props.seconds,
            active: false,
        }

        this.start = this.start.bind(this);
        this.decreaseTime = this.decreaseTime.bind(this);
    }

    start() {
        this.props.startCallback();
        this.setState({ active: true });
        setTimeout(this.decreaseTime, 1000);
    }

    decreaseTime() {
        if (this.state.seconds !== 0) {
            let seconds = this.state.seconds - 1;
            this.setState({ seconds: seconds });
            setTimeout(this.decreaseTime, 1000);
        } else {
            this.props.endCallback();
            this.setState({ seconds: this.props.seconds, active: false });
        }
    }

    render() {
        return (
            <div>
                {this.state.seconds} seconds remainig.
                {!this.state.active && <input type="submit" value="Start" onClick={this.start} />}
            </div>
        );
    }
}

export default Countdown;
