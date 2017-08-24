import * as React from "react";
import {GridList, GridTile} from 'material-ui/GridList';
import { Link } from 'react-router';

export interface Props { 
   modules: any;
   appBarTitle(msg: string): any;
   pathOnTouchTap(path:string): any
   cols: number;
}

export interface State { 

}

// 'HelloProps' describes the shape of props.
// State is never set so we use the 'undefined' type.
export default class AssessmentModules extends React.Component<Props, State> {
    componentWillMount () {
      this.props.appBarTitle('Assessment Topics');
    }
    componentWillReceiveProps(nextProps){ //not necessary unless title changes
      this.props.appBarTitle('Assessment Topics');
    }
    render() {
      const {modules,pathOnTouchTap,cols} = this.props;
      return (

          <GridList
            cols={cols}
            cellHeight={200}
          >
            {modules.map(tile => {
              return (
                <Link to={'/main/module/' + tile.id} key={tile.img}>
                <GridTile key={tile.id}
                  title={tile.title}
                >
                  <img src={require('../images/'+tile.img)} />
                </GridTile>
                </Link>
              );
            })}

          </GridList>
        );
    }
}