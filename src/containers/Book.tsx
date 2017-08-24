import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import {modules} from '../res/modules';
import {Library} from '../res/book';
import Book from '../components/Book';

const stateToProps = (state,ownProps) => {
  const isOpen = typeof ownProps.params.open !== 'undefined' ? true : false;
  const module = modules.filter(mod => ( parseInt(ownProps.params.id) === mod.id))[0];
  ;
  return {
    title: 'Library',
    book: new Library(module.slug).get(),
    isOpen: isOpen
  }
}

const dispatchToProps = (dispatch,ownProps) => {
  return {
    pageOpen: ownProps.pathOnTouchTap('/main/library/' + ownProps.params.id + '/open')
  }
}
export default connect(stateToProps,dispatchToProps)

(Book);