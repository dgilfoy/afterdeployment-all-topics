/**
 * @file assessment-test.ts
 * File in charge of tests for the assessments module.
 
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
import {assessments, assessmentIds} from '../assessments';
const WorryMaxHighScore = {
  score: 70,
  answers: {
    1: '2',
    2: '5',
    3: '2',
    4: '1',
    5: '5',
    6: '5',
    7: '5',
    8: '5',
    9: '5',
    10: '5',
    11: '5',
    12: '5',
    13: '5',
    14: '5', 
    15: '5',
    16: '5'
  }
}
const WorryMinHighScore = {
  score: 48,
  answers: {
    1: '3',
    2: '3',
    3: '3',
    4: '3',
    5: '3',
    6: '3',
    7: '3',
    8: '3',
    9: '3',
    10: '3',
    11: '3',
    12: '3',
    13: '3',
    14: '3', 
    15: '3',
    16: '3'
  }
}

const WorryMinLowScore = {
  score: 35,
  answers: {
    1: '2',
    2: '2',
    3: '2',
    4: '2',
    5: '2',
    6: '2',
    7: '2',
    8: '2',
    9: '2',
    10: '2',
    11: '2',
    12: '2',
    13: '2',
    14: '2', 
    15: '3',
    16: '5'
  }
}
// @see http://afterdeployment.dcoe.mil/sites/default/files/pdfs/assessment-tools/worry-assessment.pdf
describe("Make sure Worry Scale tests return expected results", () => {

  test('Worry Scale High', () => {
    const worryAssess = assessments['1'];
    expect(worryAssess.scoringMode).toBe(0)

    //all heighest value answers scores should == 5
    Object.keys(WorryMaxHighScore.answers).map((propName) => {
        let score = worryAssess.calcScore({[propName]: WorryMaxHighScore.answers[propName]});
        
        expect(score).toBe(5);
    });

    expect(worryAssess.calcScore(WorryMaxHighScore.answers)).toBe(WorryMaxHighScore.score);
    expect(worryAssess.calcScore(WorryMinHighScore.answers)).toBe(WorryMinHighScore.score);
  });

  test('Worry Scale Low', () => {
    const worryAssess = assessments['1'];
    expect(worryAssess.scoringMode).toBe(0)

    //all lowest value answers scores should == 0
    Object.keys(WorryMinLowScore.answers).map((propName) => {
        let score = worryAssess.calcScore({[propName]: WorryMinLowScore.answers[propName]});
        
        expect(score).toBe(0);
    });

    expect(worryAssess.calcScore(WorryMinLowScore.answers)).toBe(WorryMinLowScore.score);

  });

});



const StressMaxHighScore = {
  score: 30,
  answers: {
    1: '3',
    2: '3',
    3: '3',
    4: '3',
    5: '3', 
    6: '3',
    7: '3',
    8: '3',
    9: '3',
    10: '3'
  }
}
const StressModScore = {
  score: 20,
  answers: {
    1: '2', 
    2: '2', 
    3: '3', 
    4: '3', 
    5: '2',  
    6: '2', 
    7: '2', 
    8: '2', 
    9: '1', 
    10: '1' 
  }
}
const StressMinLowScore = {
  score: 5,
  answers: {
    1: '0', 
    2: '0', 
    3: '0', 
    4: '0', 
    5: '0',  
    6: '1', 
    7: '1', 
    8: '1', 
    9: '1', 
    10: '1' 
  }
}

describe("Make sure Stress Scale tests return expected results", () => {

  test('Stress Is High', () => {
    const StressAssess = assessments['2'];
    expect(StressAssess.scoringMode).toBe(0);
    expect(StressAssess.calcScore(StressMaxHighScore.answers)).toBe(StressMaxHighScore.score);
  });

  test('Stress Is Low', () => {
    const StressAssess = assessments['2'];
    /*
    Object.keys(StressMinLowScore.answers).map((propName) => {
        let score = StressAssess.calcScore({[propName]: StressMinLowScore.answers[propName]});
        console.log({[propName]: StressMinLowScore.answers[propName]},score);
       // expect(score).toBe(4);
    }); */
    expect(StressAssess.calcScore(StressMinLowScore.answers)).toBe(StressMinLowScore.score);

  });

});

const PanicMaxHighScore = {
  score: 119,
  answers: {
    1: '70',
    2: '15',
    3: '15',
    4: '15',
    5: '0',
    6: '0',
    7: '0',
    8: '0',
    9: '0',
    10: '0',
    11: '0',
    12: '1',
    13: '1',
    14: '1', 
    15: '1'
  }
}
const PanicMinHighScore = {
  score: 88,
  answers: {
    1: '70',
    2: '15',
    3: '0',
    4: '0',
    5: '0',
    6: '0',
    7: '0',
    8: '0',
    9: '0',
    10: '0',
    11: '1',
    12: '1',
    13: '1',
    14: '0', 
    15: '0'
  }
}

const PanicMinLowScore = {
  score: 0,
  answers: {
    1: '0',
    2: '0',
    3: '0',
    4: '0',
    5: '0',
    6: '0',
    7: '0',
    8: '0',
    9: '0',
    10: '0',
    11: '0',
    12: '0',
    13: '0',
    14: '0', 
    15: '0'
  }
}
// @see http://afterdeployment.dcoe.mil/sites/default/files/pdfs/assessment-tools/Panic-assessment.pdf
describe("Make sure Panic Scale tests return expected results", () => {

  test('Panic Scale High', () => {
    const PanicAssess = assessments['3'];
    expect(PanicAssess.scoringMode).toBe(0)

    //all heighest value answers scores should == 70
    Object.keys(PanicMaxHighScore.answers).map((propName) => {
        let score = PanicAssess.calcScore({[propName]: PanicMaxHighScore.answers[propName]});
        
        expect(score).toBe(5);
    });

    expect(PanicAssess.calcScore(PanicMaxHighScore.answers)).toBe(PanicMaxHighScore.score);
    expect(PanicAssess.calcScore(PanicMinHighScore.answers)).toBe(PanicMinHighScore.score);
  });

  test('Panic Scale Low', () => {
    const PanicAssess = assessments['3'];
    expect(PanicAssess.scoringMode).toBe(0)

    //all lowest value answers scores should == 0
    Object.keys(PanicMinLowScore.answers).map((propName) => {
        let score = PanicAssess.calcScore({[propName]: PanicMinLowScore.answers[propName]});
        
        expect(score).toBe(0);
    });

    expect(PanicAssess.calcScore(PanicMinLowScore.answers)).toBe(PanicMinLowScore.score);

  });

});

const DepressionMaxHighScore = {
  score: 84,
  answers: {
    1: '7',
    2: '7',
    3: '7',
    4: '7',
    5: '7', 
    6: '7',
    7: '7',
    8: '7',
    9: '7',
    10: '7',
    11: '7', 
    12: '7'
  }
}

const DepressionMinLowScore = {
  score: 12,
  answers: {
    1: '1',
    2: '1',
    3: '1',
    4: '1',
    5: '1', 
    6: '1',
    7: '1',
    8: '1',
    9: '1',
    10: '1',
    11: '1', 
    12: '1'
  }
}

describe("Make sure Depression tests return expected results", () => {

  test('Depression Is High', () => {
    const DepressionortAssess = assessments['4'];
    expect(DepressionortAssess.scoringMode).toBe(0);

    Object.keys(DepressionMaxHighScore.answers).map((propName) => {
        let score = DepressionortAssess.calcScore({[propName]: DepressionMaxHighScore.answers[propName]});

        expect(score).toBe(7);
    }); 

    expect(DepressionortAssess.calcScore(DepressionMaxHighScore.answers)).toBe(DepressionMaxHighScore.score);
  });

  test('Depression Is Low', () => {
    const DepressionortAssess = assessments['4'];
    
    Object.keys(DepressionMinLowScore.answers).map((propName) => {
        let score = DepressionortAssess.calcScore({[propName]: DepressionMinLowScore.answers[propName]});
     
        expect(score).toBe(1);
    }); 
    expect(DepressionortAssess.calcScore(DepressionMinLowScore.answers)).toBe(DepressionMinLowScore.score);

  });

});


