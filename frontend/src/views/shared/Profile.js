import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { changeColor } from "../../actions/theme";
import { fetchDeleteAccount } from "../../actions/auth";

class Profile extends React.Component {
  state = {
    email: "",
    phoneNumber: "",
    name: "",
    isAdmin: false
  }
  static propTypes = {
    auth: PropTypes.object.isRequired,
  };
  constructor(props) {
    super(props);
  }
  _toggleDelete = () =>{
    if(window.confirm("Are you sure you want to delete your account?")){
      this.props.fetchDeleteAccount();
    }
  }
  componentDidMount = () => {
    this.props.changeColor("#2196f3");
    let newState = this.state;
    newState.email = this.props.auth.user.username;
    newState.phoneNumber = this.props.auth.user.phoneNumber;
    newState.name = this.props.auth.user.name;
    newState.isAdmin = this.props.auth.user.isAdmin;
    this.setState(newState);
  }
  render() {
    return (
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-lg-12">
              <h4 className="view-header">Profile</h4>
            </div>

            <div className="row card" style={{ padding: '25px' }}>
              <div class="form-row">
                <div class="form-group  col-lg-6">
                  <label for="inputAddress">Name</label>
                  <input type="text" class="form-control" id="inputName" value={this.state.name} placeholder="" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group  col-lg-6">
                  <label for="inputAddress">Phone Number</label>
                  <input value={this.state.phoneNumber} type="number" class="form-control" id="inputNumber" placeholder="" />
                </div>
              </div>
              <div class="form-row">
                <div class="form-group  col-lg-6">
                  <label for="inputAddress">Is Admin</label>
                  <input value={this.state.isAdmin} type="text" class="form-control" id="inputName" value={this.state.isAdmin} placeholder="" readOnly/>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-lg-6">
                  <label for="inputEmail4">Email</label>
                  <input type="email" value={this.state.email} class="form-control" id="inputEmail" placeholder="@youremail.com" readOnly />
                </div>
              </div>
              {/* <div class="form-row">
                <div class="form-group col-lg-6">
                  <label for="inputEmail4">Password</label>
                  <input type="password" class="form-control" id="inputPassword" placeholder="********" readOnly />
                </div>
              </div> */}

              <div class="row" style={{marginBottom:'60px'}}>
                <div class="col-lg-3" style={{paddingLeft:'0px'}}>
                <button onClick={()=>{this._toggleDelete()}} type="button" class="btn btn-outline-danger">Delete My Account</button>
                </div>
                <div class="col-lg-3" style={{paddingRight:'0px'}}>
                  <a href="/auth/forgot-password" style={{float:'right'}} type="button" class="btn btn-outline-info">Change My Password</a>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group col-lg-6">
                  <button type="button" class="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Profile.propTypes = {
  changeColor: PropTypes.func.isRequired,
  fetchDeleteAccount: PropTypes.func.isRequired
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {changeColor,fetchDeleteAccount})(Profile);