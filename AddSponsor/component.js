import 'rxjs'
import React, { PureComponent } from 'react'
import PropTypes from "prop-types"
import { Field, reduxForm } from 'redux-form'
import { Redirect, Link } from 'react-router-dom'
import TopNavigation from '../../components/topNavigation'
import config,{ getQueryParam } from '../../config'
import Dropzone from 'react-dropzone'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css'
import './styles.scss'

const initialValues = {

}

class AddSponsorComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clientid: "",
      adid: "",
      name: "",
      email: "",
      phone: "",
      message: "",
      weburl: "",
      videourl: "",
      image: "",
      imageName: "",
      startDate: "",
      endDate: "",
      files: [],
      err: {},
      isLoading: false
    }
  }

  componentDidMount() {
    let adid = getQueryParam('id')
    if(adid) {
      this.setState({ adid: adid })
      const { fetchSponsorDetail } = this.props
      fetchSponsorDetail(adid)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.addSponsorPhase == "success") {
      this.setState({
        clientid: "",
        name: "",
        email: "",
        phone: "",
        message: "",
        weburl: "",
        videourl: "",
        image: "",
        imageName: "",
        files: [],
        err: {},
        isLoading: false
      })
      this.props.history.push('/ads')
    }

    if(nextProps.fetchSponsorDetailPhase == "success") {
      var sponsorData = nextProps.sponsor
      if(sponsorData) {
        this.setState({
          clientid: sponsorData.Client_id,
          adid: sponsorData.Ad_id,
          name: sponsorData.Sponsor_name,
          email: sponsorData.Email,
          phone: sponsorData.Phone,
          message: sponsorData.Message,
          weburl: sponsorData.Web_link,
          videourl: sponsorData.Video_path,
          startDate: moment(sponsorData.Start_date),
          endDate: moment(sponsorData.End_date),
          image: "",
          imageName: sponsorData.Image_path,
          files: [],
          err: {},
          isLoading: false
        })
      }
    }
  }

  onDrop(files) {
    this.setState({
      files
    });
  }

  _handleImageChange(e) {    
    e.preventDefault();
    var reader = new FileReader()
    let file = e.target.files[0];
    reader.onloadend = () => {
      this.setState({ image: reader.result, imageName:  file.name});
    }
    var read = reader.readAsDataURL(file)
  }

  handleSubmit(event) {
    const err = {}
    if (this.state.clientid === '' || this.state.clientid.trim() === '') {
      err.clientid = 'This field is required'
    }
    if (this.state.name === '' || this.state.name.trim() === '') {
      err.name = 'This field is required'
    }
    if (this.state.email === '' || this.state.email.trim() === '') {
      err.email = 'This field is required'
    } else if (this.state.email !== '' && (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email))) {
      err.email = 'Invalid email'
    }

    if (this.state.phone === '' || this.state.phone.trim() === '') {
      err.phone = 'This field is required'
    }

    if (this.state.message === '' || this.state.message.trim() === '') {
      err.message = 'This field is required'
    }

    if (this.state.weburl === '' || this.state.weburl.trim() === '') {
      err.weburl = 'This field is required'
    }

    if (this.state.videourl === '' || this.state.videourl.trim() === '') {
      err.videourl = 'This field is required'
    }

    if (this.state.startDate === '') {
      err.startDate = 'This field is required'
    }
    if (this.state.endDate === '') {
      err.endDate = 'This field is required'
    }

    if (this.state.image.trim() === "" && this.state.imageName.trim() === "") {
      err.image = 'This field is required'
    }

    this.setState({ err })
    if (!Object.keys(err).length) {
      const { addSponsor } = this.props
      this.setState({ isLoading: true })
      let data = {}
      data.Client_id = this.state.clientid
      data.Ad_id = this.state.adid
      data.image = this.state.image
      data.name = this.state.name
      data.email = this.state.email
      data.phone = this.state.phone
      data.message = this.state.message
      data.weburl = this.state.weburl
      data.videourl = this.state.videourl
      data.startDate = this.state.startDate
      data.endDate = this.state.endDate
      data.imageName = this.state.imageName
      addSponsor(data)
    }
  }

  handleChange(e) {
    this.setState({[e.target.name]:e.target.value})
  }

  removeFile() {
    this.setState({ imageName: "", image: "", files: [] })
  }

  handleStartDateChange(date) {
    this.setState({ startDate: date });
  }

  handleEndDateChange(date) {
    this.setState({ endDate: date });
  }

  render() {
    return (
      <div>
        <div className="page--container">
          <div className="analytics__page--header">
            <div className="analytics__page--header-title">
              Add Sponsor
            </div>
            <div className="analytics__page--close">
              <Link to={`/ads`}>
              <img src="img/close.svg"/></Link>
            </div>
          </div>
          <main className="page__wrapper">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="page__wrapper--form">
                    <div className="page__heading">
                      <h1 className="page__heading--title">Create an Advertisement</h1>
                      <p className="page__heading--description">Add or edit your Advertisement. The ad will show up in the app for users to see and click on if they are interested.</p>
                    </div>
                    <div className="form__heading">
                      <h1 className="form__heading--title"><span>1</span>Ad Detail</h1>
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Client ID</label>
                      <input type="text" className="form-control" name='clientid' onChange={this.handleChange.bind(this)} value={this.state.clientid}/>
                      { this.state.err.clientid ?
                      <span className="error_field_right">
                      { this.state.err.clientid}
                      </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Sponsor Name</label>
                      <input type="text" className="form-control" name='name' onChange={this.handleChange.bind(this)} value={this.state.name}/>
                      { this.state.err.name ?
                      <span className="error_field_right">
                      { this.state.err.name}
                      </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Email Address</label>
                      <input type="text" className="form-control" autoComplete="off" name='email' onChange={this.handleChange.bind(this)} value={this.state.email}/>
                      { this.state.err.email ?
                        <span className="error_field_right">
                        { this.state.err.email}
                        </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Phone</label>
                      <input type="text" className="form-control" name='phone' onChange={this.handleChange.bind(this)} value={this.state.phone}/>
                      { this.state.err.phone ?
                        <span className="error_field_right">
                        { this.state.err.phone}
                        </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Ad Sub Text</label>
                      <input type="text" className="form-control" name='message' onChange={this.handleChange.bind(this)} value={this.state.message}/>
                      { this.state.err.message ?
                        <span className="error_field_right">
                        { this.state.err.message}
                        </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Web URL</label>
                      <input type="text" className="form-control" name='weburl' onChange={this.handleChange.bind(this)} value={this.state.weburl}/>
                      { this.state.err.weburl ?
                        <span className="error_field_right">
                        { this.state.err.weburl}
                        </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Video URL</label>
                      <input type="text" className="form-control" name='videourl' onChange={this.handleChange.bind(this)} value={this.state.videourl}/>
                      { this.state.err.videourl ?
                        <span className="error_field_right">
                        { this.state.err.videourl}
                        </span> : '' }
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label className="form__heading--label">Start Date</label>
                        <DatePicker
                          name="startDate"
                          onChange={this.handleStartDateChange.bind(this)}
                          selected={this.state.startDate}
                          placeholderText="Select Start Date"
                          className="form-control"
                          dateFormat="MM/DD/YYYY"
                        />
                        { this.state.err.startDate ?
                        <span className="error_field_right">
                        { this.state.err.startDate}
                        </span> : '' }
                      </div>
                      <div className="form-group col-md-6">
                        <label className="form__heading--label">End Date</label>
                        <DatePicker
                          name="endDate"
                          onChange={this.handleEndDateChange.bind(this)}
                          selected={this.state.endDate}
                          placeholderText="Select End Date"
                          className="form-control"
                          dateFormat="MM/DD/YYYY"
                        />
                        { this.state.err.endDate ?
                        <span className="error_field_right">
                        { this.state.err.endDate}
                        </span> : '' }
                      </div>
                    </div>
                    <div className="form__heading">
                      <h1 className="form__heading--title"><span>2</span>Upload Ad Photo</h1>
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Ad Photo (recommended dimensions 46 x 46) </label>
                      <div className="dropzone__container ">
                        <div className="dropzone">
                          <Dropzone onDrop={this.onDrop.bind(this)} onChange={(e)=>this._handleImageChange(e)} className="dropzone__body" id="dz">
                            <div className="dropzone__body--title">Drag & Drop</div>
                            <div className="divider">Or</div>
                            <button className="btn btn-success">Upload File</button>
                          </Dropzone>
                        </div>
                        {this.state.imageName != "" ?
                          <aside>
                            <ul className="dropzone__container--uploaded-list">
                              <li>{this.state.imageName} <i className="fa fa-times" onClick={this.removeFile.bind(this)}></i></li>
                            </ul>
                          </aside>
                          :
                          ""
                        }
                        { this.state.err.image ?
                        <span className="error_field_right">
                        { this.state.err.image}
                        </span> : '' }
                      </div>
                    </div>
                    <button disabled={this.state.isLoading} className="btn btn-success btn-block" onClick={this.handleSubmit.bind(this)}>
                      { this.state.isLoading ? "Please Wait..." : "Save" }
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'addSponsor',  // a unique identifier for this form
  destroyOnUnmount: true,
  initialValues
})(AddSponsorComponent)
