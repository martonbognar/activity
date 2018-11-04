import React from 'react';

class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: props.seconds,
            callback: props.callback,
            active: false,
        }

        this.decreaseTime = this.decreaseTime.bind(this);
    }

    decreaseTime() {
        if (this.state.seconds !== 0) {
            let seconds = this.state.seconds - 1;
            this.setState({ seconds: seconds, active: true });
            setTimeout(this.decreaseTime, 1000);
        } else {
            this.state.callback();
            this.setState({ seconds: 30, active: false });
        }
    }

    render() {
        return (
            <div>
                {this.state.seconds} seconds remainig.
                {!this.state.active && <input type="submit" value="Start" onClick={this.decreaseTime} />}
            </div>
        );
    }
}

export default Countdown;
