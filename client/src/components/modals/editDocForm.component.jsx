import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import jwtDecode from 'jwt-decode';
import newDocument from '../../actions/documentManagement/newDocument.js';
import TinyMCE from 'react-tinymce';

/**
 * @param {Object} props 
 * @returns {Object} returns message
 */

/**
 * @export
 * @class EditDocument
 * @extends {Component}
 */
export class EditDocument extends Component {
  /**
   * Creates an instance of CreateDocument.
   * @param {Object} props 
   * @memberof CreateDocument
   */
  constructor(props) {
    super(props);
    const token = (window.localStorage.getItem('token'));
    if (token) {
      this.state = {
        id: jwtDecode(token).userId,
        email: jwtDecode(token).email
      };
    }
    this.state = {
      title: '',
      content: props.document ? props.document.content : '',
      access: props.document ? props.document.access : '',
      status: props.document ? props.document.status : '',
      ownwerId: this.state.id
    };
    this.onChange = this.onChange.bind(this);
    this.contentOnChange = this.contentOnChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  /**
   * @param {Object} nextProps
   * @memberof CreateDocument
   */
  componentWillReceiveProps(nextProps) {
    if (nextProps.status === 'success') {
    }
    if (nextProps.document) {
      this.setState({
        title: nextProps.document.title,
        content: nextProps.document.content,
        access: nextProps.document.access,
        status: nextProps.document.status
      });
      tinymce.activeEditor.setContent(nextProps.document.content);
    }
  }
  /**
   * @param {Object} event 
   * @memberof CreateDocument
   */
  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }
  /**
   * @param {Object} event
   * @memberof CreateDocument
   */
  contentOnChange(event) {
    this.setState({
      content: event.target.getContent()
    });
  }
  /**
   * @param {Object} event
   * @memberof CreateDocument
   */
  onSubmit(event) {
    event.preventDefault();
    if(this.state.content.length < 1) {
      Materialize.toast('Please add a content', 3000, 'blue');
    } else {
      this.props.onEdit(this.state, this.props.documentId);
    }
  }

  /**
   * @returns {void} returns form
   * @memberof CreateDocument
   */
  render() {
    return  (
      <div>
        <div>
          <div className='row'>
            <form id="createDocModal" className='col s12'
              onSubmit= {this.onSubmit }>
              <div className='row'>
                <div className='input-field col s12'>
                  <input
                    value={this.state.title}
                    onChange={this.onChange}
                    name='title'
                    id='title'
                    type='text'
                    className='validate'
                    required />
                  <label htmlFor='title'>Title</label>
                </div>
              </div>
              <div className='row'>
                <div className='input-field col s12'>
                  {this.state.content &&
                  <TinyMCE
                    content={this.state.content}
                    name='content'
                    config={{
                      plugins: 'autolink link image code lists print preview',
                      toolbar: 'undo redo | bold italic |\
                      alignleft aligncenter alignright | code'
                    }}
                    onChange={this.contentOnChange}
                  />
                  }
                </div>
              </div>
              <div className='col m3 s12'>
                <select
                  name='access'
                  id='access'
                  onChange={this.onChange}
                  value={this.state.access}
                  className='browser-default'
                  required
                >
                  <option value='' disabled >Select Access Type</option>
                  <option value='public'>Public</option>
                  <option value='private'>Private</option>
                  <option value='role'>Role</option>
                </select>
              </div>
              <button 
                className='btn waves-effect waves-light center auth-button'
                type='submit' name='action'>
                Save
                <i className='material-icons right'></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

/**
 * @param {Object} state 
 * @returns {Object} returns object
 */
const mapStoreToProps = (state) => {
  return {
    status: state.documentReducer.createStatus
  };
};

/**
 * @param {Object} dispatch 
 * @returns {Object} returns object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    CreateDocument: documentDetails => dispatch(newDocument(documentDetails)),
  };
};

export default connect(mapStoreToProps, mapDispatchToProps)(EditDocument);