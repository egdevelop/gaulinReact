import React, { Component, Fragment } from "react";
import "../assets/css/custom.css";
import { Redirect } from "react-router-dom";
import cookie from "js-cookie";

class Beranda extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postingan: [],
      dataKomen: [],
      formStatus: {
        nama: "",
        status: "",
      },
      dataAkun: [],
      formKomen: {
        nama: "",
        komen: "",
        id: "",
      },
      isLoaded: true,
      isLogout: false,
    };
  }
  getPost = () => {
    fetch("http://localhost:5000/api/v1/faq/post")
      .then((res) => res.json())
      .then((body) => {
        if (body.pesan) {
          return alert(body.pesan);
        }
        fetch("http://localhost:5000/api/v1/faq/komen")
          .then((res) => res.json())
          .then((hasil) => {
            if (hasil.pesan) {
              return alert(hasil.pesan);
            }
            this.setState({
              postingan: body,
              komen: hasil,
              isLoaded: true,
            });
          });
      });
  };

  postKomen = () => {
    fetch("http://localhost:5000/api/v1/faq/komen", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.formKomen),
    })
      .then((res) => res.json())
      .then((hasil) => {
        if (hasil.pesan) {
          return alert(hasil.pesan);
        }
        console.log(hasil);
        this.setState({
          formKomen: {
            nama: "",
            komen: "",
            id: "",
          },
        });
      });
  };
  postApi = () => {
    fetch("http://localhost:5000/api/v1/faq/post", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(this.state.formStatus),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.pesan) {
          return alert(data.pesan);
        }
        console.log(data);
        this.setState({
          isLoaded: false,
          formStatus: {
            nama: "",
            status: "",
          },
        });
        this.getPost();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  getAkun = () => {
    const body = cookie.get("access_token");
    fetch("http://localhost:5000/api/v1/faq/akun", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((res) => res.json())
      .then((body) => {
        if (body.pesan) {
          return alert(body.pesan);
        }
        this.setState({
          dataAkun: body,
        });
      });
  };
  componentDidMount() {
    this.getPost();
    this.getAkun();
  }

  formKomen = (event) => {
    const newKomen = { ...this.state.formKomen };
    newKomen[event.target.name] = event.target.value;
    this.setState({
      formKomen: newKomen,
    });
    event.preventDefault();
  };

  handleLogout = (e) => {
    cookie.remove("access_token");
    this.setState({
      isLogout: true,
    });
    e.preventDefault();
  };

  handleKomen = (event) => {
    this.postKomen();
    this.getPost();
    for (var i = 0; i < this.state.postingan.length; ++i) {
      console.log("inputkomen" + i + " Remove");
      document.getElementById("inputkomen" + i).value = "";
    }
    event.preventDefault();
  };
  handleKomenid(a, b, c) {
    for (var i = 0; i < this.state.postingan.length; ++i) {
      if (i !== b) {
        console.log("inputkomen" + i + " Remove");
        document.getElementById("inputkomen" + i).value = "";
      }
    }
    const newKomenid = { ...this.state.formKomen };
    newKomenid["id"] = a;
    newKomenid["nama"] = c;
    this.setState(
      {
        formKomen: newKomenid,
      },
      () => {
        console.log(this.state.formKomen);
      }
    );
  }
  handleSubmit = (event) => {
    this.postApi();
    document.getElementById("form-status").reset();
    event.preventDefault();
  };
  handleRefresh = (e) => {
    this.setState({
      isLoaded: false,
    });
    this.getPost();
    e.preventDefault();
  };
  handleForm = (event) => {
    const newPost = { ...this.state.formStatus };
    newPost[event.target.name] = event.target.value;
    this.setState({
      formStatus: newPost,
    });

    event.preventDefault();
  };

  handleFormNama(a) {
    const newNama = { ...this.state.formStatus };
    newNama["nama"] = a;
    this.setState({
      formStatus: newNama,
    });
  }
  render() {
    if (cookie.get("access_token") === undefined) {
      return <Redirect push to="/" />;
    }
    if (this.state.isLogout === true) {
      return <Redirect push to="/" />;
    }
    const { postingan, komen } = this.state;
    return (
      <Fragment>
        <nav className="navbar navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" href="/home">
              GalauIn
            </a>
            <button
              onClick={this.handleLogout}
              className="btn btn-outline-danger"
              type="submit"
            >
              Logout
            </button>
          </div>
        </nav>
        <div className="container mt-5">
          <h1> {this.state.dataAkun.nama} </h1>
          <div className="card">
            <div className="card-body">
              <form id="form-status">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Ketikan sesuatu"
                    name="status"
                    onClick={() =>
                      this.handleFormNama(this.state.dataAkun.nama)
                    }
                    onChange={this.handleForm}
                    required
                  ></textarea>
                </div>
                <button
                  onClick={this.handleSubmit}
                  className="float-right btn btn-primary"
                >
                  SUBMIT
                </button>
                <button
                  onClick={this.handleRefresh}
                  className="float-left btn btn-secondary"
                >
                  REFRESH
                </button>
              </form>
            </div>
          </div>

          {this.state.isLoaded ? null : <div>LOADINGGGG</div>}
          {postingan.map((post, index) => {
            const tanggal =
              new Date(post.created).getHours() +
              ":" +
              new Date(post.created).getMinutes();
            return (
              <div key={index} className="card mt-3">
                <div className="card-body">
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
                    alt="user-images"
                    width="40px"
                    className="rounded-circle float-left mr-3"
                  />
                  <i className="fas fa-ellipsis-h float-right"></i>
                  <p className="m-0">
                    <b> {post.nama} </b>
                  </p>
                  <p className="m-0 kecil">
                    <small> {String(tanggal)} </small>
                  </p>
                  <p className="mt-2">{post.status}</p>
                  <div className="row text-center garis">
                    <div className="col hover-abu">
                      <i className="far fa-thumbs-up">
                        <small className="ml-2">Suka</small>
                      </i>
                    </div>
                    <div className="col hover-abu">
                      <i className="far fa-comment-alt">
                        <small className="ml-2">Komentari</small>
                      </i>
                    </div>
                  </div>
                  <div className="row mt-3">
                    {/* <h6>Lihat Komentar Sebelumnya</h6> */}
                    <div className="mb-2">
                      {komen.map((kom, index) => {
                        if (kom.id_status === post._id) {
                          return (
                            <Fragment key={index}>
                              <img
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
                                alt="user-images"
                                width="30px"
                                className="rounded-circle float-left mr-3"
                              />
                              <div className="komen">
                                <p className="kecil">
                                  <b>{kom.nama}</b>
                                  <br />
                                  <small> {kom.komen} </small>
                                </p>
                              </div>
                            </Fragment>
                          );
                        }
                      })}
                    </div>

                    <div className="input-group">
                      <img
                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAM1BMVEXk5ueutLeqsbTn6eqpr7PJzc/j5ebf4eLZ3N2wtrnBxsjN0NLGysy6v8HT1tissra8wMNxTKO9AAAFDklEQVR4nO2d3XqDIAxAlfivoO//tEOZWzvbVTEpic252W3PF0gAIcsyRVEURVEURVEURVEURVEURVEURVEURVEURVEURflgAFL/AirAqzXO9R7XNBVcy9TbuMHmxjN6lr92cNVVLKEurVfK/zCORVvW8iUBnC02dj+Wpu0z0Y6QlaN5phcwZqjkOkK5HZyPAjkIjSO4fIdfcOwFKkJlX4zPu7Ha1tIcwR3wWxyFhRG6g4Je0YpSPDJCV8a2Sv2zd1O1x/2WMDZCwljH+clRrHfWCLGK8REMiql//2si5+DKWKcWeAGcFMzzNrXC/0TUwQ2s6+LhlcwjTMlYsUIQzPOCb7YBiyHopyLXIEKPEkI/TgeuiidK/R9FniUDOjRDpvm0RhqjMyyXNjDhCfIMYl1gGjIMIuYsnGEYRMRZOMMunaLVwpWRW008v6fYKDIzxCwVAeNSO90BJW6emelYBRF/kHpYGVaoxTDAaxOFsfP9y8hpJ4xd7gOcij7JNGQ1EYFgkPJa1jQEiYZXRaRINKxSDUW9n+FT82lSKadkiru9/4XPqSLWOekGPoY05TAvLm9orm+YWuwHoBHkZKijNBJGmeb61eL6Ff/6q7bLr7yvv3vKGhpDRjvgjGaPz+gUg6YgcvpyAR2FIZ9U6nEEyZRTovmEU32KichpGn7C17XrfyH9gK/c0CMP05HZIM2uf9sEveizKveBy9/6Qt7o89ne33D525cfcIMW6ab+TMEukQbQbu+xu7X3A9bChmWaCeAkG17bpntwXgWxHaMzGPmUaR5dQZiKqRVeUZ3047fi3nAu28h4CHxCsZAgmEH8Y27jJAhm8c+5RQzRQNVGhVFSfxOYIjp/pP7RxzjevYXVGf4eLt+BJ1vCuLuLkrgABgCGXZ2wik5uty+oBvNirI6mkzhAf4Gsb58Hcm67Jzd+KwD10BYPLL3e0MjvKrgAULnOfveF/O4N2Xb9BZom3gJes3F9X5Zze8/6Yt09b4CrqsEjUv8oFBaR2rl+6CZr2xVrp24o/WitBKuGrrpl1+bFkmK2qXTON4VpbdfLa7o7y/WdLxG7lm2Lqh2clOwTegbvc/vj2U78CwhA87Bn8G5Nk3eOb0Nsr9flz3sG78UUtue4kpv1xvjg3TMay62BMlTlP+vrOMnJsRmt/ze0jsfkPPYdAH57hK+34PeOyc8XIXu5xT2HsUkdZz+adwg8HGFfQ3K5jtDvbUiO4Di9/ywHGrL88pDizZ++oTp+an+SMX/ndymUCwmHMdO7yuOx83pUx/eEMU0AvxWndwgidAqOZ8ypCwdEfvvEo6D9HwpA8wzvmOJEqAg9ySu8g4x0Hb9hSB/BANEKJ+LbPBU0lzbAJs4xt1AoshKkUGQmiH8/jJ0gdhTTLmSegHlPE0oOdXALnqDjKYh3px//fSgSWG8UqfrrIICzYYSJXRr9BSPbpNzw7gBjKjKOYI7ReIGqQRIap5+5MdjyvuDkExvGeXSlONWZAP3/AZBwJohU7QJRGU+cTVH18ELmRPNBmibW6MT/k1b0XhdkRBvyT6SB6EYv/GvhSmRNpGngRULsAlxMCGNXp7w3FfdEbTEEDdLI9TdIKRUzUesa3I461ER8cpNT7gMRhpKmYVS9ELOgCUQsa4SsulciKiLbY+AnHD8cpuhISsnxpamI84sbDq9qYJgf8wiiOBrC7Ml7M7ZECCqKoiiKoiiKoiiKoijv5AvJxlZRyNWWLwAAAABJRU5ErkJggg=="
                        alt="user-images"
                        width="30px"
                        height="30px"
                        className="rounded-circle float-left mr-3 "
                      />
                      <input
                        id={"inputkomen" + index}
                        className="form-control komentar"
                        placeholder="Ketikan sesuatu...."
                        name="komen"
                        onClick={() =>
                          this.handleKomenid(
                            post._id,
                            index,
                            this.state.dataAkun.nama
                          )
                        }
                        onChange={this.formKomen}
                        aria-describedby="button-addon2"
                        onSubmit={this.handleKomen}
                        required
                      ></input>
                      <button
                        type="submit"
                        className="btn btn-outline-secondary "
                        id="button-addon2"
                        onClick={this.handleKomen}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Fragment>
    );
  }
}

export default Beranda;
