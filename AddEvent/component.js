import 'rxjs'
import React, { PureComponent } from 'react'
import PropTypes from "prop-types"
import { Field, reduxForm } from 'redux-form'
import { Redirect, Link } from 'react-router-dom'
import config,{ getQueryParam } from '../../config'
import TopNavigation from '../../components/topNavigation'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css'
import Dropzone from 'react-dropzone'
import './styles.scss'
import GoogleAutoComplete from '../../components/googleAutocomplete';
import axios from 'axios'


const usStates = [
{"label":"Alabama","value":"AL"},
{"label":"Alaska","value":"AK"},
{"label":"Arizona","value":"AZ"},
{"label":"Arkansas","value":"AR"},
{"label":"California","value":"CA"},
{"label":"Colorado","value":"CO"},
{"label":"Connecticut","value":"CT"},
{"label":"Delaware","value":"DE"},
{"label":"District of Columbia","value":"DC"},
{"label":"Florida","value":"FL"},
{"label":"Georgia","value":"GA"},
{"label":"Hawaii","value":"HI"},
{"label":"Idaho","value":"ID"},
{"label":"Illinois","value":"IL"},
{"label":"Indiana","value":"IN"},
{"label":"Iowa","value":"IA"},
{"label":"Kansa","value":"KS"},
{"label":"Kentucky","value":"KY"},
{"label":"Lousiana","value":"LA"},
{"label":"Maine","value":"ME"},
{"label":"Maryland","value":"MD"},
{"label":"Massachusetts","value":"MA"},
{"label":"Michigan","value":"MI"},
{"label":"Minnesota","value":"MN"},
{"label":"Mississippi","value":"MS"},
{"label":"Missouri","value":"MO"},
{"label":"Montana","value":"MT"},
{"label":"Nebraska","value":"NE"},
{"label":"Nevada","value":"NV"},
{"label":"New Hampshire","value":"NH"},
{"label":"New Jersey","value":"NJ"},
{"label":"New Mexico","value":"NM"},
{"label":"New York","value":"NY"},
{"label":"North Carolina","value":"NC"},
{"label":"North Dakota","value":"ND"},
{"label":"Ohio","value":"OH"},
{"label":"Oklahoma","value":"OK"},
{"label":"Oregon","value":"OR"},
{"label":"Pennsylvania","value":"PA"},
{"label":"Rhode Island","value":"RI"},
{"label":"South Carolina","value":"SC"},
{"label":"South Dakota","value":"SD"},
{"label":"Tennessee","value":"TN"},
{"label":"Texas","value":"TX"},
{"label":"Utah","value":"UT"},
{"label":"Vermont","value":"VT"},
{"label":"Virginia","value":"VA"},
{"label":"Washington","value":"WA"},
{"label":"West Virginia","value":"WV"},
{"label":"Wisconsin","value":"WI"},
{"label":"Wyoming","value":"WY"}
]
const initialValues = {
}

class AddEventComponent extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      clientid: '',
      eventid: 0,
      program_id: 60,
      eventData: null,
      title: "",
      description: "",
      address: "",
      city: "",
      state: "",
      zipcode: "",
      image: "",
      imageName: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: "",
      reply: "",
      type: "G",
      point: 0,
      lat: 0,
      lng: 0,
      files: [],
      err: {},
      isLoading: false
    }
  }

  componentDidMount() {
    let eventid = getQueryParam('id')
    if(eventid) {
      this.setState({ eventid: eventid })
      const { fetchEventDetail } = this.props
      fetchEventDetail(eventid)
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.fetchDetailPhase == "success") {
      var eventData = nextProps.event
      if(eventData) {
        let address = eventData.Location_address + ", " + eventData.City + ", " + eventData.State
        this.setState({
          clientid: eventData.Client_id,
          eventid: eventData.Event_id,
          title: eventData.Location_name,
          startDate: moment(eventData.Start_date),
          endDate: moment(eventData.End_date),
          description: eventData.Comments,
          address: address,
          street_number: (eventData.Location_address != "" ? eventData.Location_address.split(" ")[0] : ""),
          route: (eventData.Location_address != "" ? eventData.Location_address.split(" ")[1] : ""),
          city: eventData.City,
          state: eventData.State,
          zipcode: "",
          image: "",
          imageName: eventData.Image_path,
          startTime: eventData.Start_hour,
          endTime: eventData.End_hour,
          reply: eventData.Reply,
          type: eventData.Type,
          point: eventData.Point,
          program_id: eventData.Program_id,
          lat: eventData.Lat,
          lng: eventData.Long,
          files: [],
          err: {},
          isLoading: false
        })
      }
    }
    if(nextProps.addEventPhase == "success") {
      this.setState({
        clientid: '',
        eventid: 0,
        title: "",
        startDate: "",
        endDate: "",
        description: "",
        address: "",
        street_number: "",
        route: "",
        city: "",
        state: "",
        zipcode: "",
        image: "",
        imageName: "",
        startTime: "",
        endTime: "",
        reply: "",
        type: "G",
        point: 0,
        lat: 0,
        lng: 0,
        program_id: 60,
        files: [],
        err: {},
        isLoading: false
      })
      this.props.history.push('/events')
    }
  }

  onDrop(files) {
    this.setState({ files:files })
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

  removeFile() {
    this.setState({ imageName: "", image: "", files: [] })
  }

  handleChange(e){
    this.setState({ [e.target.name]:e.target.value })
  }

  handleSubmit(event) {
    const err = {}
    if (this.state.clientid === '' || this.state.clientid.trim() === '') {
      err.title = 'This field is required'
    }
    if (this.state.title === '' || this.state.title.trim() === '') {
      err.title = 'This field is required'
    }
    if (this.state.description === '' || this.state.description.trim() === '') {
      err.description = 'This field is required'
    }
    if (this.state.address === '' || this.state.address.trim() === '') {
      err.address = 'This field is required'
    }
    if (this.state.startDate === '') {
      err.startDate = 'This field is required'
    }
    if (this.state.endDate === '') {
      err.endDate = 'This field is required'
    }
    if (this.state.startTime === '') {
      err.startTime = 'This field is required'
    }
    if (this.state.endTime === '') {
      err.endTime = 'This field is required'
    }
    if (parseInt(this.state.program_id) === 0) {
      err.startDate = 'This field is required'
    }
    if (this.state.startDate !== '' && this.state.endDate !== '') {
      if (new Date(this.state.endDate) < new Date(this.state.startDate)) {
        err.endDate = 'End date should be greater than Start date'
      }
    }
    if (this.state.startTime !== '' && this.state.endTime !== '') {
      if (parseInt(this.state.endTime) < parseInt(this.state.startTime)) {
        err.endTime = 'End time should be greater than Start time'
      }
    }
    if (this.state.image.trim() === "" && this.state.imageName.trim() === "") {
      err.image = 'This field is required'
    }
    if (this.state.lat === "" || parseInt(this.state.lat) === 0) {
      err.lat = 'This field is required'
    }
    if (this.state.lng === "" || parseInt(this.state.lng) === 0) {
      err.lng = 'This field is required'
    }
    this.setState({ err })
    if (!Object.keys(err).length) {
      const { addEvent } = this.props
      this.setState({ isLoading: true })
      let data = {}
      data.Client_id = this.state.clientid
      data.Event_id = this.state.eventid
      data.title = this.state.title
      data.description = this.state.description
      data.address = (this.state.street_number + " " + this.state.route)
      data.city = this.state.city
      data.state = this.state.state
      data.zipcode = this.state.zipcode
      data.startDate = this.state.startDate
      data.endDate = this.state.endDate
      data.startTime = this.state.startTime
      data.endTime = this.state.endTime
      data.reply = this.state.reply
      data.type = this.state.type
      data.program_id = this.state.program_id
      data.lat = this.state.lat
      data.lng = this.state.lng
      data.image = this.state.image
      data.imageName = this.state.imageName      
      addEvent(data)
    }
  }

  handlePlaceChanged(value) {
    this.setState({ address: value })
    var city = ""
    if(value !== "") {
      axios({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/geocode/json?address='+value+'&key='+process.env.GOOGLE_MAP_KEY,
      })
      .then((res) => {
        if (res.data.results[0]) {
          for(var i = 0 ; i < res.data.results[0].address_components.length; i++) {
            if(res.data.results[0].address_components[i].types[0] === 'street_number'){
              var street_number = res.data.results[0].address_components[i].long_name
              this.setState({ street_number: street_number })
            }

            if(res.data.results[0].address_components[i].types[0] === 'route'){
              var route = res.data.results[0].address_components[i].long_name
              this.setState({ route: route })
            }

            if(res.data.results[0].address_components[i].types[0] === 'postal_code'){
              const pincode = res.data.results[0].address_components[i].long_name
              this.setState({ zipcode: pincode })
            }

            if(res.data.results[0].address_components[i].types[0] === 'locality') {
               city = res.data.results[0].address_components[i].long_name
              this.setState({ city: city })
            }
            if(res.data.results[0].address_components[i].types[0] === 'neighborhood' && city  == "") {
              city = res.data.results[0].address_components[i].long_name
              this.setState({ city: city })
            }
            if(res.data.results[0].address_components[i].types[0] === 'administrative_area_level_2' && city  == "") {
              city = res.data.results[0].address_components[i].long_name
              this.setState({ city: city })
            }
            if(res.data.results[0].address_components[i].types[0] === 'administrative_area_level_1') {
              const state = res.data.results[0].address_components[i].long_name
              var filter = usStates.filter(function (obj){
                return obj.label === state;
              })
              if(filter.length > 0){
                this.setState({ state: filter[0].value })
              }
            }
          }

          if(res.data.results[0].geometry) {
            this.setState({ lat: res.data.results[0].geometry.location.lat, lng: res.data.results[0].geometry.location.lng })
          }
        }
      })
    }
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
              Add Event
            </div>
            <div className="analytics__page--close">
              <Link to={`/events`}>
              <img src="img/close.svg"/></Link>
            </div>
          </div>
          <main className="page__wrapper">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="page__wrapper--form">
                    <div className="page__heading">
                      <h1 className="page__heading--title">Create an Event</h1>
                      <p className="page__heading--description">
                        Add or edit your event. The event will show up in the app for users to say if they are
                        going or not. Once it's created you will be able to track how many people are going.
                      </p>
                    </div>
                    <div className="form__heading">
                      <h1 className="form__heading--title"><span>1</span>Event Details</h1>
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
                      <label className="form__heading--label">Event Title</label>
                      <input type="text" className="form-control" name='title' onChange={this.handleChange.bind(this)} value={this.state.title}/>
                      { this.state.err.title ?
                      <span className="error_field_right">
                      { this.state.err.title}
                      </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Event Addresss</label>
                      <Field type="text"
                        {...this.props}
                        name="address"
                        component={GoogleAutoComplete}
                        id="addressSearchBoxField"
                        value={this.state.address}
                        onSelectPlace={this.handlePlaceChanged.bind(this)}
                        valueS={this.state.address}
                      />
                      { this.state.err.address ?
                      <span className="error_field_right">
                      { this.state.err.address}
                      </span> : '' }
                    </div>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label className="form__heading--label">Latitude</label>
                        <input type="text" className="form-control" name='lat' onChange={this.handleChange.bind(this)} value={this.state.lat}/>
                        { this.state.err.lat ?
                        <span className="error_field_right">
                        { this.state.err.lat}
                        </span> : '' }
                      </div>
                      <div className="form-group col-md-6">
                        <label className="form__heading--label">Longitude</label>
                        <input type="text" className="form-control" name='lng' onChange={this.handleChange.bind(this)} value={this.state.lng}/>
                        { this.state.err.lng ?
                        <span className="error_field_right">
                        { this.state.err.lng}
                        </span> : '' }
                      </div>
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
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form__heading--label">Start Time</label>
                      <select name="startTime" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.startTime}>
                        <option value='00'>00:00 AM</option>
                        <option value='01'>01:00 AM</option>
                        <option value='02'>02:00 AM</option>
                        <option value='03'>03:00 AM</option>
                        <option value='04'>04:00 AM</option>
                        <option value='05'>05:00 AM</option>
                        <option value='06'>06:00 AM</option>
                        <option value='07'>07:00 AM</option>
                        <option value='08'>08:00 AM</option>
                        <option value='09'>09:00 AM</option>
                        <option value='10'>10:00 AM</option>
                        <option value='11'>11:00 AM</option>
                        <option value='12'>12:00 PM</option>
                        <option value='13'>13:00 PM</option>
                        <option value='14'>14:00 PM</option>
                        <option value='15'>15:00 PM</option>
                        <option value='16'>16:00 PM</option>
                        <option value='17'>17:00 PM</option>
                        <option value='18'>18:00 PM</option>
                        <option value='19'>19:00 PM</option>
                        <option value='20'>20:00 PM</option>
                        <option value='21'>21:00 PM</option>
                        <option value='22'>22:00 PM</option>
                        <option value='23'>23:00 PM</option>
                      </select>
                      { this.state.err.startTime ?
                      <span className="error_field_right">
                      { this.state.err.startTime}
                      </span> : '' }
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form__heading--label">End Time</label>
                      <select name="endTime" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.endTime}>
                        <option value='00'>00:00 AM</option>
                        <option value='01'>01:00 AM</option>
                        <option value='02'>02:00 AM</option>
                        <option value='03'>03:00 AM</option>
                        <option value='04'>04:00 AM</option>
                        <option value='05'>05:00 AM</option>
                        <option value='06'>06:00 AM</option>
                        <option value='07'>07:00 AM</option>
                        <option value='08'>08:00 AM</option>
                        <option value='09'>09:00 AM</option>
                        <option value='10'>10:00 AM</option>
                        <option value='11'>11:00 AM</option>
                        <option value='12'>12:00 PM</option>
                        <option value='13'>13:00 PM</option>
                        <option value='14'>14:00 PM</option>
                        <option value='15'>15:00 PM</option>
                        <option value='16'>16:00 PM</option>
                        <option value='17'>17:00 PM</option>
                        <option value='18'>18:00 PM</option>
                        <option value='19'>19:00 PM</option>
                        <option value='20'>20:00 PM</option>
                        <option value='21'>21:00 PM</option>
                        <option value='22'>22:00 PM</option>
                        <option value='23'>23:00 PM</option>
                      </select>
                      { this.state.err.endTime ?
                      <span className="error_field_right">
                      { this.state.err.endTime}
                      </span> : '' }
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label className="form__heading--label">Event Type</label>
                      <select name="type" className="form-control" onChange={this.handleChange.bind(this)} value={this.state.type}>
                        <option value='G'>G</option>
                        <option value='Q'>Q</option>
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label className="form__heading--label">Program Id</label>
                      <select className="form-control" name='program_id' onChange={this.handleChange.bind(this)} value={this.state.program_id}>
                          <option value='60'>Event</option>
                          <option value='61'>Group Event 1</option>
                          <option value='62'>Group Event 2</option>
                          <option value='63'>Group Event 3</option>
                      </select>
                      { this.state.err.program_id ?
                      <span className="error_field_right">
                      { this.state.err.program_id}
                      </span> : '' }
                    </div>
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Event Description</label>
                      <textarea className="form-control" rows="8"  name='description' onChange={this.handleChange.bind(this)} value={this.state.description}></textarea>
                      { this.state.err.description ?
                      <span className="error_field_right">
                      { this.state.err.description}
                      </span> : '' }
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Reply</label>
                      <textarea className="form-control" rows="8"  name='reply' onChange={this.handleChange.bind(this)} value={this.state.reply}></textarea>
                    </div>
                    <div className="form__heading">
                      <h1 className="form__heading--title"><span>2</span>Upload Event Photo</h1>
                    </div>
                    <div className="form-group">
                      <label className="form__heading--label">Event Photo (recommended dimensions 375 x 322)  </label>
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
  form: 'addevent',  // a unique identifier for this form
  destroyOnUnmount: true,
  initialValues
})(AddEventComponent)
