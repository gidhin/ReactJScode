import 'rxjs'
import React, { PureComponent } from 'react'
import PropTypes from "prop-types"
import { Field, reduxForm } from 'redux-form'
import { Redirect, Link } from 'react-router-dom'
import TopNavigation from '../../components/topNavigation'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css'
import './styles.scss'

const initialValues = {
}

class EventComponent extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchEvents } = this.props
    fetchEvents()
  }
  componentWillReceiveProps(np){
    if(np.deleteEventPhase == "success") {
       const { fetchEvents } = this.props
       fetchEvents()
    }
  }
  deleteEvent(id) {
    const {deleteEvent} = this.props
    deleteEvent(id)
  }
  render() {
    const { events, fetchPhase } = this.props
    let eventList = "";
    if(events && events.length > 0) {
      eventList =  events.map((val, index) => {
        return (
          <tr key={index}>
            <td>
              <div className="title">
                <strong>Title:</strong> {val.Location_name}
              </div>
              <div className="address">
                Address: {val.Location_address}, {val.City}, {val.State}
              </div>
            </td>
            <td>{val.Views}</td>
            <td>{val.Goings}</td>            
            <td> 
              {val.Qr_Image_Url ?
                <a href={val.Qr_Image_Url} target="_blank">Get Qr Code</a>
                :
                ""
              }
            </td>
            <td>
              <button className="btn btn__delete" onClick={this.deleteEvent.bind(this, val.Event_id)}>Delete</button>
              <Link className="btn btn__edit" to={`/add-event?id=${val.Event_id}`}>Edit</Link>
            </td>
          </tr>
        )
      })
    }
    return (
      <div>
        <TopNavigation {...this.props}/>
        <div className="event__page--container">
          <div className="event__wrapper">
            <div className="container">
              <div className="row">
                <div className="col-md-8">
                  <div className="event__container">
                    <h1 className="event__container--title">Events</h1>
                    <p className="event__container--description">View the list of events that have been uploaded onto the platform. </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="event__btn--wrapper text-right">
                    <Link to={`/add-event`} className="btn btn-event">Create Event</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="event__table--wrapper">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  {fetchPhase === "loading" ?
                    <div className="text-center" style={{paddingTop: '20px'}}>
                      <h4>Loading... Please wait...</h4>
                    </div>
                    :
                    <table className="table table-striped event__table--content">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Views</th>
                          <th>Going</th>
                          <th colSpan="2"></th>
                        </tr>
                      </thead>                      
                      <tbody>
                        {eventList}
                      </tbody>                      
                    </table>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default reduxForm({
  form: 'events',  // a unique identifier for this form
  destroyOnUnmount: true,
  initialValues
})(EventComponent)
