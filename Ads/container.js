import { connect } from 'react-redux'
import { handleSignOut } from '../../store/user/duck'
import { fetchSponsors, updateSponsor } from '../../store/ads/duck'
import Ads from './component'
const AdsContainer = connect(
  // Map state to props
  (state) => ({
  	fetchSponsorPhase: state.ads.fetchSponsorPhase,
    updateSponsorPhase: state.ads.updateSponsorPhase,
  	sponsors: state.ads.sponsors
  }),
  // Map actions to props
  {
  	fetchSponsors,
    updateSponsor,
  	handleSignOut
  }
)(Ads)
export default AdsContainer
