import 'rxjs'
import React, { PureComponent } from 'react'
import PropTypes from "prop-types"
import { Field, reduxForm } from 'redux-form'
import { Redirect, Link } from 'react-router-dom'
import TopNavigation from '../../components/topNavigation'
import DatePicker from 'react-datepicker'
import moment from 'moment';
import ToggleButton from 'react-toggle-button'
import 'react-datepicker/dist/react-datepicker.css'
import './styles.scss'

const HOSTNAME = process.env.API_HOSTNAME

const initialValues = {
}

class AdsComponent extends PureComponent {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { fetchSponsors } = this.props
    fetchSponsors()
  }

  componentWillReceiveProps(nextProps) {
    const { fetchSponsors } = this.props
    if (nextProps.updateSponsorPhase === "success") {
      fetchSponsors()
    }
  }

  onToggle(v) {
    const { updateSponsor } = this.props
    var status = 0;
    if(v.Status === 0) {
      status = 1
    }
    var postData = {}
    postData.Ad_id = v.Ad_id
    postData.Status = status
    updateSponsor(postData);
  }

  render() {
    const { sponsors, fetchSponsorPhase } = this.props
    let sponsorList = "";
    if(sponsors && sponsors.length > 0) {
      sponsorList =  sponsors.map((val, index) => {        
        return (
          <tr key={index}>
            <td>
              <div className="title">
                <strong>Title:</strong> {val.Sponsor_name}
              </div>
              <div className="address">
                {val.Email}
              </div>
              <div className="address">
                {val.Web_link}
              </div>
            </td>
            <td>{val.Clicks}</td>
            <td>
              <span className="switch-btn">
                <ToggleButton
                  key={index}
                  value={val.Status}
                  onToggle={this.onToggle.bind(this, val)}
                  className="cmn-toggle cmn-toggle-round" />                
              </span>
            </td>
            <td>
              <Link className="btn btn__edit" to={`/add-sponsor?id=${val.Ad_id}`}>Edit</Link>
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
                    <h1 className="event__container--title">Ads</h1>
                    <p className="event__container--description">View the list of ads that have been uploaded onto the platform. </p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="event__btn--wrapper text-right">
                    <Link to={`/add-sponsor`} className="btn btn-event">Create Ad</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="event__table--wrapper">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  {fetchSponsorPhase === "loading" ?
                    <div className="text-center" style={{paddingTop: '20px'}}>
                      <h4>Loading... Please wait...</h4>
                    </div>
                    :
                    <table className="table table-striped event__table--content">
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Clicks</th>
                          <th>Off/On</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {sponsorList}
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
  form: 'ads',  // a unique identifier for this form
  destroyOnUnmount: true,
  initialValues
})(AdsComponent)
