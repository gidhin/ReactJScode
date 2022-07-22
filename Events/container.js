import { connect } from 'react-redux'
import { handleSignOut } from '../../store/user/duck'
import { fetchEvents,deleteEvent } from '../../store/event/duck'
import EventComponent from './component'
const EventContainer = connect(
  // Map state to props
  (state) => ({
  	fetchPhase: state.event.fetchPhase,
  	events: state.event.events,
  	errorMessage: state.event.errorMessage,
    deleteEventPhase: state.event.deleteEventPhase
  }), 
  // Map actions to props
  {  	
  	fetchEvents,
    deleteEvent,
  	handleSignOut
	}
)(EventComponent)
export default EventContainer
