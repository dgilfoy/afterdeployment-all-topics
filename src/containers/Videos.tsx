import Videos from '../components/Videos';
import * as videos from '../res/videos';
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
  return 1;
}

const stateToProps = (state, ownProps) => {
  let module = modules.filter(mod => ( parseInt(ownProps.params.id) === mod.id)),
    modVidsStr = module[0].slug;
  return {
    videos: videos[modVidsStr + 'Vids'].map(item => {
      return item;
    }), // add default logic here eventually, so there's a fallback if an object with this name does not exist
    cols: getCols(state.device),
    moduleID : module[0].id
  }
}
const dispatchToProps = (dispatch) => {
  return {
  }
}
export default connect(stateToProps,dispatchToProps)

(Videos);