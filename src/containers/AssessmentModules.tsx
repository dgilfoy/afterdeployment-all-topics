import AssessmentModules from '../components/AssessmentModules';
import {modules} from '../res/modules';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
const getCols = (device) => {
  const width = device.width;
  if(!width){
    return 1;
  }
  if(width > 900){
    return 4;
  }
  if(width > 600){
    return 2;
  }
  return 1
}
const stateToProps = (state) => {
  return {
    modules: modules,
    cols: getCols(state.device)
  }
}
const dispatchToProps = (dispatch) => {
  return {
  }
}
export default connect(stateToProps,dispatchToProps)

(AssessmentModules);