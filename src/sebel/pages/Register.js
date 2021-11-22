import React, { Component, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";
import cookie from "js-cookie";
import "../assets/css/custom.css";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formRegister: {
        nama: "",
        username: "",
        pw: "",
      },
      isRegister: false,
    };
  }

  postLogin = () => {
    fetch("http://localhost:5000/api/v1/faq/regis", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.formRegister),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.pesan) {
          return alert(body.pesan);
        }
        this.setState({
          isRegister: true,
        });
      });
  };

  handleLoginSubmit = (e) => {
    this.postLogin();
    e.preventDefault();
  };

  handleFormRegister = (e) => {
    const newForm = { ...this.state.formRegister };
    newForm[e.target.name] = e.target.value;
    this.setState(
      {
        formRegister: newForm,
      },
      () => {
        console.log(this.state.formRegister);
      }
    );
    e.preventDefault();
  };
  render() {
    if (cookie.get("access_token") !== undefined) {
      return <Redirect push to="/home" />;
    }
    if (this.state.isRegister === true) {
      return <Redirect push to="/" />;
    }
    return (
      <Fragment>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/home">
              GalauIn
            </a>
          </div>
        </nav>
        <div className="container">
          <div className="card mt-3">
            <div className="card-body">
              <div className="row">
                <div className="col">
                  <img
                    alt="foto-login"
                    className="foto-login"
                    src="https://leaderonomics.com/wp-content/uploads/2017/04/1807658-1-600x470.jpg"
                  />
                </div>
                <div className="col">
                  <h2 className="my-5">Register Page</h2>
                  <form>
                    <div className="mb-3">
                      <input
                        onChange={this.handleFormRegister}
                        placeholder="Nama"
                        name="nama"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        onChange={this.handleFormRegister}
                        placeholder="Username"
                        name="username"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        onChange={this.handleFormRegister}
                        placeholder="Password"
                        name="pw"
                        className="form-control"
                        required
                      />
                    </div>
                    <button
                      onClick={this.handleLoginSubmit}
                      className="btn btn-block btn-primary"
                    >
                      REGISTER
                    </button>
                  </form>
                  <p>
                    Punya Akun?
                    <Link to="/">Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Register;
