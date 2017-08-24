/**
 * @file Assessment.ts
 * File in charge of displaying data for the assessments module.
 
 * Name: assessments.ts
 * Purpose of this file is to provide various functionality for the Assessments Module
 *
 * Modified by Daniel Gilfoy <daniel.gilfoy@tee2.org> on 5/13/2017.
 *
 * Assessment Module - Life Stress
 *
 * Copyright © 2009-2017 United States Government as represented by
 * the Chief Information Officer of the National Center for Telehealth
 * and Technology. All Rights Reserved.
 *
 * Copyright © 2009-2017 Contributors. All Rights Reserved.
 *
 * THIS OPEN SOURCE AGREEMENT ("AGREEMENT") DEFINES THE RIGHTS OF USE,
 * REPRODUCTION, DISTRIBUTION, MODIFICATION AND REDISTRIBUTION OF CERTAIN
 * COMPUTER SOFTWARE ORIGINALLY RELEASED BY THE UNITED STATES GOVERNMENT
 * AS REPRESENTED BY THE GOVERNMENT AGENCY LISTED BELOW ("GOVERNMENT AGENCY").
 * THE UNITED STATES GOVERNMENT, AS REPRESENTED BY GOVERNMENT AGENCY, IS AN
 * INTENDED THIRD-PARTY BENEFICIARY OF ALL SUBSEQUENT DISTRIBUTIONS OR
 * REDISTRIBUTIONS OF THE SUBJECT SOFTWARE. ANYONE WHO USES, REPRODUCES,
 * DISTRIBUTES, MODIFIES OR REDISTRIBUTES THE SUBJECT SOFTWARE, AS DEFINED
 * HEREIN, OR ANY PART THEREOF, IS, BY THAT ACTION, ACCEPTING IN FULL THE
 * RESPONSIBILITIES AND OBLIGATIONS CONTAINED IN THIS AGREEMENT.
 *
 * Government Agency: The National Center for Telehealth and Technology
 * User Registration Requested. Please send email
 * with your contact information to: robert.a.kayl.civ@mail.mil
 * Government Agency Point of Contact for
 * Original Software: robert.a.kayl.civ@mail.mil
 */ 
import * as React from "react";
import Form, {ValidationResultInterface} from './Form';
export interface ItemInterface{
  title: string;
  questions: any[];
  questionPrefix : string;
}

export interface Props { 
  appBarTitle(msg: string): any;
  item: ItemInterface;
  values: any;
  questions : any;
  submitData(data: any): void;
  validateData(data: any): ValidationResultInterface; 
  cancel(): void;
}

export interface State { 
  questions : any[];
}

export default class Assessment extends React.Component<Props, State> {
    constructor(props){
      super(props);
      const {item,questions} = this.props;
      this.state = {
        questions : questions
      }
    }
    componentWillMount () {
      const {item} = this.props;

      this.props.appBarTitle(item.title);
      window.scrollTo(0,0);
    }

    componentWillReceiveProps(nextProps) {
      const {item} = nextProps;
 
      this.props.appBarTitle(item.title);
    }
    
    handleChange = (values) => {
      const {item} = this.props;
      let newQuestions = this.props.item['calcQuestions'](values);
      if(newQuestions){
        this.setState({questions: this.props.item['calcQuestions'](values)});
      }
    }

    render() {
        const {item, submitData, validateData,cancel,values} = this.props;
        const {questions} = this.state;
        const qpstyles = {
          'border'  : '1px solid red',
          'color'   : 'red',
          'padding' : '5px'
        };
        return (
          <div>
            {item.questionPrefix.length > 0 
              && <h3 style={qpstyles}>{item.questionPrefix}</h3>
            }
            <Form values={values} items={questions} handleChange={this.handleChange} cancel={cancel} validateData={validateData} submitData={submitData} />
          </div>
        );
    }
}