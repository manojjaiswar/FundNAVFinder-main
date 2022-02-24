import react, { Component } from "react";
import ChatBot from 'react-simple-chatbot';
import PropTypes from 'prop-types';
import axios from "axios";

class Price extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            result: '',
            trigger: false,
            Symbol: null,
            result2: '',
        };
    }
    async componentWillMount() {
        const { steps } = this.props;
        console.log(steps);
        const { Symbol } = steps;

        const sym = steps[9].value.toUpperCase()
        const sym2 = steps[36].value.toUpperCase()
        this.setState({ result2: sym2 })
        this.setState({ result: sym })
        const a = (await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${sym}${sym2}`))
        console.log(a)
        // const a = await axios.get(`https://api.covalenthq.com/v1/pricing/tickers/?quote-currency=USD&format=JSON&tickers=${steps[9].value}&key=ckey_ecf46a8674d649acb3cb172f4ad`)
        const b = a.data.price
        this.setState({ Symbol: b })

    }
    render() {
        return (
            <div>
                <h5>
                    Price of {this.state.result} in {this.state.result2} is ${this.state.Symbol}
                </h5>
            </div>
        )
    }
}
Price.propTypes = {
    steps: PropTypes.object,
};
Price.defaultProps = {
    steps: undefined,
};
export default Price;