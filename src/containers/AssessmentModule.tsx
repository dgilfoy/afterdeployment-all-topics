import BasicPage from '../components/BasicPage';
import {modules} from '../res/modules';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';

const stateToProps = (state, ownProps) => {
  let module = modules.filter(mod => ( parseInt(ownProps.params.id) === mod.id))[0],
    actions = [];
  if( module.assessments.length > 0){
    actions.push({label: 'Assessments', action: ownProps.pathOnTouchTap('main/assessments/' + module.id)});
  }
  actions.push({label: 'Videos', action: ownProps.pathOnTouchTap('main/videos/' + module.id)});
  actions.push({label: 'Library', action: ownProps.pathOnTouchTap('main/library/' + module.id)});
  return {
    title: module.title,
    page: {title: 'Overview', subtitle: module.title + ' Module', content: module.content},
    image: module.img && !(state.device.width > 600 || state.device.width > state.device.height)? module.img : '',
    
    actions: actions
  }
}
const dispatchToProps = (dispatch) => {
  return {
  }
}
export default connect(stateToProps,dispatchToProps)

(BasicPage);