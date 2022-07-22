import { connect } from 'react-redux'
import { handleSignOut } from '../../store/user/duck'
import { addEvent, fetchEventDetail } from '../../store/event/duck'
import AddEvent from './component'
const AddEventContainer = connect(
  // Map state to props
  (state) => ({
  	addEventPhase: state.event.addEventPhase,
  	fetchDetailPhase: state.event.fetchDetailPhase,
  	event: state.event.event
  }),
  // Map actions to props 
  {
  	handleSignOut,
  	addEvent,
  	fetchEventDetail
  }  
)(AddEvent)
export default AddEventContainer
