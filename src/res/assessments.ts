/**
 * @file assessments.ts
 * File in charge of massaging data for the assessments module.
 
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
import {combineReducers} from 'redux';
import { normalize, schema } from 'normalizr';

import * as objectAssign from 'object-assign';

import { assessmentsDataJ } from './assessment-data';
import { 
  ScoringInterface, 
  ChoicesInterface, 
  QuestionInterface, 
  AssessmentInterface, 
  makeAssessment, 
  makeScoring, 
  makeQuestion,
  defaultCalcScore
} from './assessment-struct';

const assessmentSchema = new schema.Entity('assessment');
const assessmentListSchema = new schema.Array(assessmentSchema);

interface AssessmentTreeInterface {
  [propName: string]: AssessmentInterface;
}

const calcPanicQuestions = function(values: any = {}){
   const firstQuestionId = '1';
   let firstQuestionYes = false;
   if(typeof values[firstQuestionId] !== 'undefined' && values[firstQuestionId] === '70'){
     firstQuestionYes = true;
   }
   if(!firstQuestionYes){
      console.log(this.questions[0]);
      return [this.questions[0]];
   }
   return this.questions;
}

/**
 *  Group of Assessments, all type cast to Assessment Interface
 *  can't type an empty array, so this is a bit of a workaround, not ideal.
 * 
 * @class AssessmentsGroup
 */
class AssessmentsGroup{
  private assessments = [];
  add( assessment ){
    this.newAssessment(assessment);
  }
  newAssessment( assessment : AssessmentInterface ){
    this.assessments.push(assessment);  
  }
  get(key){
    return this.assessments[key];
  }
  getAll(){
    return this.assessments;
  }
}

/**
 * Logic for building an assessment, separated out from previous version so if data needs to come from an API or other method this file doesn't need to be changed (much)
 * 
 * @class Assessment
 */
class Assessment{
  public data = {};
  constructor( adata : Object ) {
    if(adata['title'] === 'Panic'){
      this.data = this.callbackAssessment(adata,calcPanicQuestions);
    }else{
      this.data = this.defaultAssessment(adata);
    }
  }
  /**
   *   Get the generated assessment data
   * 
   * @returns object : assessment (AssessmentInterface)
   * 
   * @memberof Assessment
   */
  get() : Object {
    return this.data;
  }
  /**
   * sets the scoring data and casts it as a ScoringInterface array
   * 
   * @param {Array} scoringData 
   * @returns ScoringInterface[] retS
   * 
   * @memberof Assessment
   */
  getScoring( scoringData : Array<any> ) : ScoringInterface[] {
    let scoring: ScoringInterface[] = [];
    // create an array of scores
    Object.keys(scoringData).map(function(k){
      let sd = scoringData[k];
      scoring.push( makeScoring(sd[0],sd[1],sd[2],sd[3],sd[4],sd[5]));
    });
    return scoring;
  }
  /**
   * Builds the questions out, assigning each question the relevant choices.
   * 
   * @param {Array} questions - array of questions for the assessment
   * @param {Array} choices - choices for which the assessment questions will use as answers
   * @returns QuestionInterface[] retQs - the returned questions, built out with relevant choices added
   * 
   * @memberof Assessment
   */
  getQuestions( questions : Object, choices : Array<any> ) : QuestionInterface[]{
    let questionGroup : QuestionInterface[] = [];
    // create an array of questions, adding the choices to them
    Object.keys(questions).map(function(k){
      let qData = questions[k],
      choice : ChoicesInterface[] = choices[qData[3]];
      questionGroup.push(makeQuestion(qData[0],qData[1],qData[2],choice));
    });
    return questionGroup;
  }
  callbackAssessment( adata : Object, callback ) : AssessmentInterface {
    return makeAssessment(
      adata['id'],
      adata['title'], 
      adata['questionPrefix'],
      adata['maxScore'], 
      adata['midScore'], 
      adata['minScore'],
      adata['scoringMode'],
      this.getScoring(adata['scoring']),
      this.getQuestions(adata['questions'],adata['choices']),
      require('../images/'+adata['image']),
      calcPanicQuestions
    );
  }
  /**
   * Default assessment creation, uses the default callback
   * @param adata Object - assessment data object 
   */
  defaultAssessment( adata : Object ) : AssessmentInterface {
    return makeAssessment(
      adata['id'],
      adata['title'], 
      adata['questionPrefix'],
      adata['maxScore'], 
      adata['midScore'], 
      adata['minScore'],
      adata['scoringMode'],
      this.getScoring(adata['scoring']),
      this.getQuestions(adata['questions'],adata['choices']),
      require('../images/'+adata['image'])
    );
  }
}

// build the assessment from the assessment data (eventually JSON)
var assessmentsRaw = new AssessmentsGroup();
Object.keys(assessmentsDataJ).map(function(key){
  let adata = new Assessment(assessmentsDataJ[key]);
  assessmentsRaw.add(adata.get());
});

// normalize the data using the schema
const normalData = normalize(assessmentsRaw.getAll(),assessmentListSchema);

export const assessments: AssessmentTreeInterface = normalData.entities.assessment;
export const assessmentIds = normalData.result;