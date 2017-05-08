/* eslint-disable import/prefer-default-export */
/* eslint-disable no-undef */
import axios from 'axios';
import { browserHistory } from 'react-router';
import * as actionTypes from '../actionTypes';
import setAuthorizationToken from '../../utils/setAuth';

/**
 * Add new Document
 * @export
 * @param {Object} details
 * @returns {Object} return object
 */
export default (details) => {
  const token = window.localStorage.getItem('token');
  return (dispatch) => {
    setAuthorizationToken(token);
    return axios.post('/api/document', details)
      .then((document) => {
        dispatch({
          type: actionTypes.DOCUMENT_CREATED,
          document,
          status: 'success'
        });
        Materialize.toast('Document created', 2000, 'green');
      }).catch((err) => {
        Materialize.toast(
          'Something went wrong creating a new document',
          3000,
          'red'
          );
        dispatch({
          type: actionTypes.DOCUMENT_CREATE_FAILED,
          status: 'failed',
          error: err.message
        });
      });
  };
};
