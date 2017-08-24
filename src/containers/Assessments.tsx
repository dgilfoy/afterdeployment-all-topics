import Assessments from '../components/Assessments';
import {assessments, assessmentIds} from '../res/assessments';
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

const stateToProps = (state, ownProps) => {
  let module = modules.filter(mod => ( parseInt(ownProps.params.id) === mod.id)),
    moduleAssessments = Object.keys(module[0].assessments).map(id=>{
      return assessments[module[0].assessments[id]];
  });
  return {
    title: module[0].title,
    assessments: moduleAssessments,
    cols: getCols(state.device)
  }
}

const dispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(stateToProps,dispatchToProps)

(Assessments);