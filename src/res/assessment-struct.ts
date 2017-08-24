/**
 * @file assessment-struct.ts
 * File containing most of the "structure" (interfaces, etc) for the assessments part of the module.
 
 * Name: assessment-struct.ts
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
export interface ScoringInterface{
  id: number;
  min: number;
  max: number;
  
  title: string;
  description: string;
  recommendations: string;
}

export interface ChoicesInterface{
  title: string;
  value: string;
  score: number;
}

export interface QuestionInterface{
  id: number;
  title: string;
  type: string;
  choices: ChoicesInterface[];
}

export interface AssessmentInterface{
  id: number;
  title: string;
  questionPrefix : string;
  maxScore: number;
  middleScore: number;
  minScore: number;
  scoringMode: number;
  scoring: ScoringInterface[];
  questions: QuestionInterface[];
  image: string;
  calcQuestions(values:any) : QuestionInterface[];
  calcScore(values: any): number;
}

export const makeAssessment = (id,title, questionPrefix: string, minScore: number, middleScore: number, maxScore: number, scoringMode: number, scoring: ScoringInterface[], questions: QuestionInterface[], image='',calcQuestions: (any) => any = defaultCalcQuestion, calcScore: (any) => any = defaultCalcScore ):AssessmentInterface => {
  return {
    id,
    title,
    minScore,
    questionPrefix,
    middleScore,
    maxScore,
    scoringMode,
    scoring,
    questions,
    image,
    calcQuestions,
    calcScore
  }
}
export const makeScoring = (id: number,min,max,title,description='',recommendations=''): ScoringInterface => {
  return {
    id,
    min,
    max,
    title,
    description,
    recommendations
  }
}

export const makeQuestion = (id: number,title,type='text',choices = []): QuestionInterface => {
  return {
    id,
    title,
    type,
    choices
  }
}

export const defaultCalcQuestion = function(values: any){
      return this.questions;
}
export const defaultCalcScore = function(values: any){
    function tallyScore (answers, questions) {
      var total = 0;
      Object.keys(questions).map(function (idx) {
          let question = questions[idx];

          let choiceValue = answers[question.id];
          let choices = questions[idx].choices;
          if(choices){
            choices.map((choice) => {
              if(choice.value === choiceValue){
                total += parseInt(choice.score);
              }
            });
          }
      });
      return total;
    }
    return tallyScore(values,this.questions);
}