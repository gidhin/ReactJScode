import { connect } from 'react-redux'
import { handleSignOut } from '../../store/user/duck'
import { addSponsor , fetchSponsorDetail } from '../../store/ads/duck'
import AddSponsor from './component'
const AddSponsorContainer = connect(
  // Map state to props
  (state) => ({
  	addSponsorPhase: state.ads.addSponsorPhase,
  	fetchSponsorDetailPhase: state.ads.fetchSponsorDetailPhase,
  	sponsor: state.ads.sponsor
  }),
  // Map actions to props
  {
  	addSponsor,
  	fetchSponsorDetail,
  	handleSignOut
  }
)(AddSponsor)
export default AddSponsorContainer
