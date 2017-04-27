import React, { Component } from 'react';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import Navbar from '../nav.component.js';
import Searchbar from '../containers/searchbar.jsx';
import AdminDashboard from './admin.component.jsx';
import UserDashboard from './user.component.jsx';
import { bindActionCreators } from 'redux';
import * as docActions from '../../actions/documentManagement/readDocument.js';
import * as userActions from '../../actions/userManagement/getUsers.js';

class Dashboard extends Component {
  constructor(props) {
    super(props)
    const token = window.localStorage.getItem('token');
    this.state = {
      AdminRoleId: 1,
      authUser: jwtDecode(token) || {},
    }
  }

  componentWillMount() {
    const userId = this.state.authUser.userId || null
    this.props.actionsDoc.viewUserDocuments(userId);
    this.props.actionsUser.viewUsers(userId);
    console.log('***', this.props);
  }

  render() {
    const roleId = this.state.authUser.roleId || null
    return (roleId === this.state.AdminRoleId) ?
      <AdminDashboard documents={this.props.documents} users= {this.props.users}/> :
      <UserDashboard documents={this.props.documents} />
  }
}

const mapStoreToProps = (state) => {
  return {
    documents: state.documentReducer,
    users: state.userReducer
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    actionsDoc: bindActionCreators(docActions, dispatch),
    actionsUser: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStoreToProps, mapDispatchToProps)(Dashboard);
