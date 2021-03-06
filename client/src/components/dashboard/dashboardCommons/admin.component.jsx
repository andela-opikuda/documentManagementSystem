import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import jwtDecode from 'jwt-decode';
import { Pagination } from 'react-materialize';
import Navbar from '../../commons/nav.component.js';
import SubNavBar from '../../commons/subNavBar.jsx';
import AllDocuments from '../userDashboard/allDocs.component.jsx';
import Users from '../../dashboard/adminDashboard/usersView.component.js';
import Roles from '../../dashboard/adminDashboard/rolesView.component.js';
import MyDocuments from '../userDashboard/myDocs.component.jsx';
import Search from '../userDashboard/search.component.jsx';
import EditDocumentModal from '../../modals/editDocForm.component.jsx';
import DeleteDocumentAction from
'../../../actions/documentManagement/deleteDocuments';
import EditDocumentAction from
'../../../actions/documentManagement/editDocument.js';
import * as userActions from '../../../actions/userManagement/getUsers.js';
import * as roleActions from '../../../actions/roleManagement/getRoles.js';
import deleteUserAction from '../../../actions/userManagement/deleteUser';
import editUserActions from '../../../actions/userManagement/editUser.js';
import searchDocuments from '../../../actions/documentManagement/searchDocs.js';
import searchUsers from '../../../actions/userManagement/searchUsers.js';


/**
 * Admin dashboard
 * @class AdminDashboard
 * @extends {Component}
 */
class AdminDashboard extends Component {
  /**
   * Creates an instance of AdminDashboard.
   * @param {Object} props 
   * @memberof AdminDashboard
   */
  constructor(props) {
    super(props);
    this.setEditDocument = this.setEditDocument.bind(this);
    this.setDeleteDocument = this.setDeleteDocument.bind(this);
    this.setViewDocument = this.setViewDocument.bind(this);
    this.setUserRole = this.setUserRole.bind(this);
    this.handleSearchBarView = this.handleSearchBarView.bind(this);
    const token = window.localStorage.getItem('token');
    this.state = {
      documents: props.documents || [],
      AdminRoleId: 1,
      searchBarView: 'noShow',
      authUser: jwtDecode(token) || {},
      roleId: 1

    };
  }
  /**
   * @param {Object} nextProps 
   * @memberof AdminDashboard
   */
  componentWillReceiveProps(nextProps){
    const keys = ['users', 'documents', 'roles'];
    keys.forEach(key=>{
      if(nextProps[key]){
        this.setState({
          [key]: nextProps[key]
        });
      }
    });
  }


  /**
   * @param {Object} view 
   * @memberof AdminDashboard
   */
  handleSearchBarView(view) {
    this.setState({ searchBarView: view });
    $('ul.tabs').tabs('select_tab', 'searchTab');    
  }

  /**
   * @param {Object} document 
   * @memberof AdminDashboard
   */
  setViewDocument(document) {
    this.setState({
      viewTitle: document.title,
      viewDocument: document.content,
      documentId: document.id
    });
  }

  /**
   * @param {Object} document 
   * @memberof AdminDashboard
   */
  setEditDocument(document){
    this.setState({
      editDocument: document,
      documentId: document.id
    });
  }
  /**
   * @param {Object} event 
   * @param {Object} id 
   * @memberof AdminDashboard
   */
  setUserRole(event, id) {
    this.setState({ roleId: event.target.value });
    this.props.updateUser({ roleId: event.target.value }, id);
  }
  /**
   * @param {Object} documentId 
   * @memberof AdminDashboard
   */
  setDeleteDocument(callback, documentId) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this file!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: true
    },
    function(){
      callback(documentId);
    });
  }

  /**
   * @param {Object} documentId 
   * @memberof AdminDashboard
   */
  setDeleteUser(callback, userId) {
    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this user!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete the user!",
      closeOnConfirm: true
    },
    function(){
      callback(userId);
    });
  }
  /**
   * @memberof AdminDashboard
   */
  componentWillMount() {
    const userId = this.state.authUser.userId || null
    this.props.actionsUser.viewUsers();
    this.props.actionsRole.viewRoles();
  }
  /**
   * @memberof AdminDashboard
   */
  componentDidMount() {
    $('.modal').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      // ready: function (modal, trigger) {
      //  // Callback for Modal open. Modal and trigger parameters available.
      //   alert("Ready");
      // },
      complete: function () {
      } // Callback for Modal close
    });
    $('ul.tabs').tabs();
  }
  /**
   * @returns {void} return admin dashboard
   * @memberof AdminDashboard
   */
  render() {
    return (
      <div>
        <div id="modalEdit" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4>Edit Document</h4>
            <EditDocumentModal
              document={this.state.editDocument || null}
              documentId={this.state.documentId || null}
              onEdit={this.props.EditingDocument} />
          </div>
          <div className="modal-footer">
            <a className="modal-action modal-close waves-effect waves-green btn-flat">
              Close
            </a>
          </div>
        </div>
        <div id="modalView" className="modal modal-fixed-footer">
          <div className="modal-content">
            <h4 className="center">View Document</h4>
            <h5>Title</h5>
            <div>{ this.state.viewTitle }</div>
            <h5>Content</h5>            
            <div dangerouslySetInnerHTML={{ __html: this.state.viewDocument}} />
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-action modal-close waves-effect waves-green btn-flat ">
              Close
            </a>
          </div>
        </div>
        
        <div className="main-container">
          <div className="bg"></div>
          <Navbar />
          <SubNavBar handleSearchBarView={this.handleSearchBarView}/>
          <div className="row">
            <div className="tab-row">
              <ul className="tabs tabs-fixed-width">
                <li className="tab"><Link to="#test1" className="active">All Documents</Link></li>
                <li className="tab"><Link to="#test2" id="userlist">User List</Link></li>
                <li className="tab"><Link to="#test3" id="rolelist">Role List</Link></li>
                <li className="tab"><Link to="#test4" id="t">My Documents</Link></li>
                <li className="tab"><Link to="#searchTab">Search</Link></li>
              </ul>
            </div>

            <div id="test1" className="tab-content col s12">
              <center className="pagination-key">
                <Pagination id="allPagination" className="pag"
                  items={this.props.documentPages}
                  maxButtons={8}
                  onSelect={(page) => {
                    const offset = (page - 1) * 10;
                    this.props.pagination(offset);
                  }}
                  />
              </center>
              <AllDocuments
                document={this.state.documents}
                setViewDocument={this.setViewDocument} />
            </div>
            <div id="test2" className="tab-content col s12">
              <center className="pagination-key">
                <Pagination id="userPagination" className="pag"
                  items={this.props.userPages}
                  maxButtons={8}
                  onSelect={(page) => {
                    const offset = (page - 1) * 10;
                    this.props.actionsUser.viewUsers(offset);
                  }}
                  />
              </center>
              <Users setUserRole={this.setUserRole} users={this.props.users}
                roles={this.props.roles} deleteUser={this.props.deleteUser}
                setDeleteUser={this.setDeleteUser}/>
            </div>
            <div id="test3" className="tab-content col s12">
              <Roles roles={this.props.roles} />
            </div>
            <div id="test4" className="tab-content col s12">
              <MyDocuments document={this.state.documents}
                setEditDocument={this.setEditDocument}
                setViewDocument={this.setViewDocument}
                setDeleteDocument={this.setDeleteDocument}
                delete= {this.props.DeleteDocument} />
            </div>
            <div id="searchTab" className="tab-content col s12">
              <center className="pagination-key">
                <Pagination id="searchPagination" className="pag"
                  items={this.state.searchBarView ?
                  this.props.documentSearchPages : this.props.userSearchPages}
                  maxButtons={8}
                  onSelect={(page) => {
                    const offset = (page - 1) * 10;
                    {this.state.searchBarView ?
                    this.props.DocSearch(this.props.documentSearchQuery, offset)
                    :
                    this.props.UserSearch(this.props.userSearchQuery, offset) }
                  }}
                  />
              </center>
              <Search
                documentsSearch={this.props.documentsSearch}
                setViewDocument={this.setViewDocument}
                usersSearch={this.props.usersSearch}
                view= {this.state.searchBarView}
                user='admin' />
            </div>
          </div>
        </div>
      </div>
    );
  }
}


/**
 * @param {Object} state 
 * @returns {Object} object
 */
const mapStoreToProps = (state) => {
  return {
    documentPages: state.documentReducer.pageCount,
    documentSearchPages: state.documentReducer.searchPageCount,
    documentSearchQuery: state.documentReducer.query,
    userSearchPages: state.userReducer.searchPageCount,
    userSearchQuery: state.userReducer.query,
    userPages: state.userReducer.pageCount
  };
};

/**
 * @param {Object} dispatch 
 * @returns {void} returns actions as props
 */
const mapDispatchToProps = (dispatch) => {
  return {
    EditingDocument: (documentDetails, documentId) =>
    dispatch(EditDocumentAction(documentDetails, documentId)),
    DeleteDocument: (documentId) => dispatch(DeleteDocumentAction(documentId)),
    actionsUser: bindActionCreators(userActions, dispatch),
    actionsRole: bindActionCreators(roleActions, dispatch),
    deleteUser: (userId) => dispatch(deleteUserAction(userId)),
    updateUser: (userData, userId) =>
    dispatch(editUserActions(userData, userId)),
    UserSearch: (query, offset) => dispatch(searchUsers(query, offset)),
    DocSearch: (query, offset) => dispatch(searchDocuments(query, offset))
  };
};
export default connect(mapStoreToProps, mapDispatchToProps)(AdminDashboard);
