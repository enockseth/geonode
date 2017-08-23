import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getResponseData, getErrorCount } from '../../../utils';
import HoverPaper from '../../atoms/hover-paper';
import HR from '../../atoms/hr';
import ResponseTable from '../../cels/response-table';
import styles from './styles';
import actions from './actions';


const mapStateToProps = (state) => ({
  errorNumber: state.geonodeLayerError.response,
  interval: state.interval.interval,
  response: state.geonodeLayerResponse.response,
  timestamp: state.interval.timestamp,
});


@connect(mapStateToProps, actions)
class WSLayerAnalytics extends React.Component {
  static propTypes = {
    errorNumber: PropTypes.object,
    getErrors: PropTypes.func.isRequired,
    getResponses: PropTypes.func.isRequired,
    interval: PropTypes.number,
    resetErrors: PropTypes.func.isRequired,
    resetResponses: PropTypes.func.isRequired,
    response: PropTypes.object,
    timestamp: PropTypes.instanceOf(Date),
  }

  constructor(props) {
    super(props);
    this.get = (interval = this.props.interval) => {
      this.props.getErrors(interval);
      this.props.getResponses(interval);
    };

    this.reset = () => {
      this.props.resetErrors();
      this.props.resetResponses();
    };
  }

  componentWillMount() {
    this.get();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      if (nextProps.timestamp && nextProps.timestamp !== this.props.timestamp) {
        this.get(nextProps.interval);
      }
    }
  }

  componentWillUnmount() {
    this.reset();
  }

  render() {
    let average = 0;
    let max = 0;
    let requests = 0;
    [
      average,
      max,
      requests,
    ] = getResponseData(this.props.response);
    const errorNumber = getErrorCount(this.props.errorNumber);
    return (
      <HoverPaper style={styles.content}>
        <h3>W*S Layers Analytics</h3>
        <HR />
        <ResponseTable
          average={average}
          max={max}
          requests={requests}
          errorNumber={errorNumber}
        />
      </HoverPaper>
    );
  }
}


export default WSLayerAnalytics;
