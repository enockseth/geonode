import { createAction } from 'redux-actions';
import { fetch, sequenceInterval } from '../../../../utils';
import apiUrl from '../../../../backend';
import { GEONODE_MEMORY_SEQUENCE } from '../constants';


const reset = createAction(
  GEONODE_MEMORY_SEQUENCE,
  () => ({ status: 'initial' })
);


export const begin = createAction(
  GEONODE_MEMORY_SEQUENCE,
  () => ({ status: 'pending' })
);


const success = createAction(
  GEONODE_MEMORY_SEQUENCE,
  response => ({
    response,
    status: 'success',
  })
);


const fail = createAction(
  GEONODE_MEMORY_SEQUENCE,
  error => ({
    status: 'error',
    error,
  })
);


const get = (argInterval) =>
  (dispatch) => {
    dispatch(begin());
    const interval = sequenceInterval(argInterval);
    const url = `${apiUrl}/metric_data/mem.usage/?last=${argInterval}&interval=${interval}`;
    fetch({ url })
      .then(response => {
        dispatch(success(response));
        return response;
      })
      .catch(error => {
        dispatch(fail(error.message));
      });
  };

const actions = {
  reset,
  begin,
  success,
  fail,
  get,
};

export default actions;
