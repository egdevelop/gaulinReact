import React, { Component, Fragment } from "react";
import { Redirect, Link } from "react-router-dom";
import cookie from "js-cookie";
import "../assets/css/custom.css";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fromLogin: {
        username: "",
        pw: "",
      },
      isLogin: false,
      isLoginBtnClick: false,
    };
  }

  postLogin = () => {
    fetch("http://localhost:5000/api/v1/faq/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.fromLogin),
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.pesan) {
          this.setState({
            isLoginBtnClick: false,
          });
          return alert(body.pesan);
        }
        if (!body.access_token) {
          this.setState({
            isLoginBtnClick: false,
          });
          console.log("SEVER INTERNAL ERROR");
          return alert(body.message);
        } else {
          cookie.set("access_token", body);
          this.setState({
            isLogin: true,
          });
        }
      });
  };

  handleLoginSubmit = (e) => {
    this.setState({
      isLoginBtnClick: true,
    });
    this.postLogin();
    e.preventDefault();
  };

  handleFormLogin = (e) => {
    const newForm = { ...this.state.fromLogin };
    newForm[e.target.name] = e.target.value;
    this.setState({
      fromLogin: newForm,
    });
    e.preventDefault();
  };
  render() {
    if (cookie.get("access_token") !== undefined) {
      return <Redirect push to="/home" />;
    }
    if (this.state.isLogin === true) {
      return <Redirect push to="/home" />;
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
                    src="https://img.freepik.com/free-photo/3d-futuristic-background-with-connecting-lines-dots_1048-8805.jpg?size=626&ext=jpg&ga=GA1.2.1265832862.1610323200"
                  />
                </div>
                <div className="col">
                  <h2 className="my-5">Login Page</h2>
                  <form>
                    <div className="mb-3">
                      <input
                        onChange={this.handleFormLogin}
                        placeholder="Username"
                        name="username"
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <input
                        type="password"
                        onChange={this.handleFormLogin}
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
                      {this.state.isLoginBtnClick ? "LOADING..." : "LOGIN"}
                    </button>
                  </form>
                  <p>
                    Tidak Punya Akun?<Link to="/regis">Daftar</Link>
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

export default Login;
