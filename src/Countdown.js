import React from 'react';

class Countdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: props.seconds,
            active: false,
            timeout: null,
        }

        this.start = this.start.bind(this);
        this.decreaseTime = this.decreaseTime.bind(this);
    }

    start() {
        this.props.startCallback();
        let timeout = setTimeout(this.decreaseTime, 1000);
        this.setState({ active: true, timeout: timeout });
    }

    componentWillUnmount() {
        if (this.state.timeout) {
            clearTimeout(this.state.timeout);
        }
    }

    decreaseTime() {
        if (this.state.seconds !== 0) {
            let seconds = this.state.seconds - 1;
            let timeout = setTimeout(this.decreaseTime, 1000);
            this.setState({ seconds: seconds, timeout: timeout });
        } else {
            this.props.endCallback();
            let audio = document.getElementById("warning");
            audio.play();
            this.setState({ seconds: this.props.seconds, active: false });
        }
    }

    render() {
        return (
            <div>
                {!this.state.active && <button className="btn btn-danger float-right" type="button" onClick={this.start}>Start</button>}<p>{this.state.seconds} seconds remaining.</p>
            </div>
        );
    }
}

export default Countdown;
