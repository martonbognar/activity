import React from 'react';

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

export default Countdown;
