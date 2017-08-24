import { normalize, schema } from 'normalizr';
var path = require('path');

const assessmentSchema = new schema.Entity('assessment');
const assessmentListSchema = new schema.Array(assessmentSchema);

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
  id: number|string;
  title: string;
  type: string;
  choices: ChoicesInterface[];
}

export interface AssessmentInterface{
  id: number;
  title: string;
  maxScore: number;
  middleScore: number;
  minScore: number;
  scoringMode: number;
  scoring: ScoringInterface[];
  questions: QuestionInterface[];
  image: string;
  calcQuestions(values: any): QuestionInterface[];
  calcScore(values: any): number;
  validate(data:{[propName: string]: string}): {data: {[propName: string]: string}, isValid: boolean}
}
const defaultCalcQuestion = function(values: any){

      return this.questions;
}

const defaultCalcScore = function(values: any){

    function tallyScore (answers, questions) {
      var total = 0;
   
      Object.keys(questions).map(function (idx) {
          let question = questions[idx];
          if(answers && typeof answers[question.id] !== 'undefined'){
            let choiceValue = answers[question.id];
            let choices = questions[idx].choices;

            if(choices){
              choices.map((choice) => {
                if(choice.value === choiceValue){
                  total += parseInt(choice.score);
                }
              });
            }
          }
      });

      return total;
    }


    return tallyScore(values,this.questions);
}
function defaultValidation(data:{[propName: string]: string}): { data:{[propName: string]: string}, isValid: boolean} {
    let hasErrors = false;

    const filteredData = this.calcQuestions(data)
        .filter((question) => {
          return question.type !== 'label'
        })
        .reduce((acc,question) => {
            acc[question.id] = typeof data[question.id] !== 'undefined' ? data[question.id] : '';
            return acc;
        },{});

    const reduceCb = (errors, name) => {
      if(filteredData[name].length === 0){
        hasErrors = true;
        errors[name] = 'Required.';
      } else {
        errors[name] = '';
      }
      
      return errors;
    };

    const errors = Object.keys(filteredData)
      .map((propName) => propName)
      .reduce(reduceCb,{});

      console.log(errors);

    return {
      data: errors,
      isValid: !hasErrors
    }
}

export const makeAssessment = (id,title, minScore: number, middleScore: number, maxScore: number, scoring: ScoringInterface[], scoringMode: number, questions: QuestionInterface[], image='',calcQuestions: (any) => any = defaultCalcQuestion, calcScore: (any) => any = defaultCalcScore,validate: (any) => any = defaultValidation ):AssessmentInterface => {
  return {
    id,
    title,
    minScore,
    middleScore,
    maxScore,
    scoring,
    scoringMode,//1: High score is good, 0: high score is bad
    questions,
    image,
    calcQuestions,
    calcScore,
    validate
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

export const makeQuestion = (id: number|string,title,type='text',choices = []): QuestionInterface => {
  return {
    id,
    title,
    type,
    choices
  }
}

const PostTraumaticStressList: ScoringInterface[] = [];


const PostTraumaticStressScoring0 = makeScoring(1,0,33,'LOW',
                                    `<p>Your score reflects that you are not experiencing symptoms that are typically associated with post-traumatic stress.</p><p>Although only a healthcare professional can provide an actual diagnosis of post-traumatic stress, or its absence, your results suggest that your experience is not similar to the experience of individuals suffering from post-traumatic stress.</p>`,
                                    `<p>Your results suggest you are managing this area of your life.  Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” program.</p><p>You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p><p>You’re also encouraged to check out other assessments on AfterDeployment as they can be helpful for learning more about whether or not you are having problems in other areas.  For your convenience, you can find links to the tools that were mentioned here through the RESOURCES tab located above.</p>`
                                    );



const PostTraumaticStressScoring1 = makeScoring(2,34,43,'MOD',
                                    `<p>Although only a healthcare professional can provide an actual diagnosis, you are reporting some experiences which are similar to some moderate symptoms  associated with Post-traumatic stress.</p>`,
                                    `<p>Having experiences that are somewhat similar to those associated with post-traumatic stress doesn’t mean you have post-traumatic stress disorder (PTSD).  It does mean that you should look into the concerns you are reporting because they can be upsetting and distressing.  If you’ve experienced these symptoms for more than a few weeks, or they are getting worse, you should consult your health care provider.  If you don’t have one, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.   If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore these experiences is to check out the materials in AfterDeployment’s “Post-Traumatic Stress” topic. When someone is experiencing the kinds of distressing symptoms you report, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PostTraumaticStressScoring2 = makeScoring(3,44,85,'HIGH',
                                    `<p>Although only a healthcare professional can provide an actual diagnosis, your score indicates that you are experiencing a significant number of symptoms that are similar to those associated with post-traumatic stress.</p>`,
                                    `<p>Having experiences that are very similar to those associated with post-traumatic stress suggests that you should look into these concerns because they can be very upsetting and disruptive of your life.   If you’ve experienced these symptoms for more than a few weeks, or they are getting worse, you should consult your health care provider immediately.  If you don’t have one, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Post-Traumatic Stress” topic. Also, when someone is experiencing the kinds of distressing symptoms you report, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const DepressionList: ScoringInterface[] = [];


const DepressionScoring3 = makeScoring(4,0,4,'LOW',
                                    `<p>Although only a healthcare professional can provide an actual diagnosis, your score is in a range not typically associated with depression or mood problems. </p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const DepressionScoring4 = makeScoring(5,5,15,'MOD',
                                    `<p>Although only a healthcare professional can provide an actual diagnosis, your score is in a range not typically associated with depression or mood problems. However you have indicated that you have had thoughts of hurting yourself in the last month. Please review your answers to determine if they accurately reflect your mood. </p><p><strong>IF YOU ARE HAVING THOUGHTS OF SELF HARM SEEK HELP IMMEDIATELY.</strong> </p>`,
                                    `<p>You have indicated that you have recently had thoughts of harming yourself. Please review your answers to determine if they accurately reflect your mood. </p>  <p><strong>IF YOU ARE HAVING THOUGHTS OF SELF HARM SEEK HELP IMMEDIATELY.</strong></p> <p>If you would like to speak with someone, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website. If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const DepressionScoring5 = makeScoring(6,16,27,'HIGH',
                                    `<p>Although only a healthcare professional can provide an actual diagnosis, your score is in a range typically associated with mild or moderate depression. </p>`,
                                    `<p>After a deployment, service members often report brief periods of feeling down, having low energy, or losing interest in things they used to enjoy. Depression is a problem that you can do something about. We encourage you to check out the materials in AfterDeployment’s "Depression" topic.  In addition to the materials on AfterDeployment, you may benefit from discussing your mood problem with a health care provider. If your mood problem lasts several weeks to a few months, or if you believe that your depression is getting worse, contact a healthcare provider and share the results of this assessment. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore these experiences is to check out the materials in AfterDeployment’s “Depression” topic. When someone is experiencing the kinds of distressing concerns you report, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const mTBISymptomManagementList: ScoringInterface[] = [];


const mTBISymptomManagementScoring9 = makeScoring(10,0,59,'LOW',
                                    `<p>Your score is in a range typically associated with a low level of confidence in your ability to cope with and manage many of the symptoms of your brain injury.</p><p>Although only a healthcare professional can provide a complete evaluation,   your concerns over your ability to cope with your injury are significant and may have the potential to interfere with your recovery.</p>`,
                                    `<p>A decrease in self-confidence can be common following an injury like a traumatic brain injury.  It is important to identify where you believe support is lacking or additional support is required and begin to problem-solve around getting what you need.  If you find that your confidence in your ability to cope with the problems created by your brain injury has not gradually improved, it is important to discuss these issues with your family and your health care provider. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.   If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p> Another way to explore these experiences is to check out the materials in AfterDeployment’s “mTBI” topic. When someone is struggling with managing the symptoms of a traumatic brain injury, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const mTBISymptomManagementScoring10 = makeScoring(11,60,114,'MOD',
                                    `<p>Compared to others with  a traumatic brain injury, your score is in a range typically associated with a moderate amount of confidence in your ability to cope with the symptoms associated with your brain injury.</p><p>Although only a healthcare professional can provide a complete evaluation, your responses suggest you may be feeling somewhat uncertain in your ability to get help with or manage the symptoms of your injury.</p>`,
                                    `<p>A decrease in self-confidence can be common following an injury like a traumatic brain injury.  It is important to identify where you believe support is lacking or additional support is required and begin to problem-solve around getting what you need .  If you find that your confidence in your ability to cope with the problems created by your brain injury has not gradually improved, it is important to discuss these issues with your family and your health care provider.  If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website. If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When someone is experiencing the kinds of distressing symptoms you report, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const mTBISymptomManagementScoring11 = makeScoring(12,115,130,'HIGH',
                                    `<p>Your score is in a range typically associated with a high level of confidence in your ability to cope with your traumatic brain injury compared to others with a TBI.</p><p>Although only a healthcare professional can provide a completely accurate evaluation, your results suggest that you believe you will be able to positively manage the consequences of  your brain injury.  Self-confidence in this area is often associated with symptom improvement.</p>`,
                                    `<p>A decrease in self-confidence can be common following an injury like a traumatic brain injury.  It is important to identify where you believe support is lacking or additional support is required and begin to problem-solve around getting what you need .  If you find that your confidence in your ability to cope with the problems created by your brain injury has not gradually improved, it is important to discuss these issues with your family and your health care provider.  If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website. If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When someone is experiencing the kinds of distressing symptoms you report, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.   </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const AngerList: ScoringInterface[] = [];


const AngerScoring12 = makeScoring(13,0,22,'LOW',
                                    `<p>Your score is in a range typically associated with low anger.</p>  <p>Although only a healthcare professional can provide an actual diagnosis, your results suggest that you don’t seem to be having difficulties with anger right now.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const AngerScoring13 = makeScoring(14,23,42,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate amount of anger.</p>  <p>Although only a healthcare professional can provide an actual diagnosis, your responses suggest you may be feeling angry often or having problems controlling your anger. </p>`,
                                    `<p>Anger can be common following a deployment. Anger can also be an appropriate emotion in some circumstances. But anger that persists or that is out of control can be harmful to your physical health, your emotional well-being, and your relationships. If your anger is not improving, or is getting harder to manage, you need to get help.  If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7. <p>When someone is struggling with controlling anger, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. We also encourage you to check out AfterDeployment’s  materials in the "Anger" topic.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const AngerScoring14 = makeScoring(15,43,56,'HIGH',
                                    `<p>Your score is in a range typically associated with a significant amount of anger.</p>  <p>Although only a healthcare professional can provide an actual diagnosis, anger may be causing significant problems in your relationships, your work, and your health.</p>`,
                                    
                                    `<p>Anger can be common following a deployment. Anger can also be an appropriate emotion in some circumstances. But anger that persists or that is out of control can be harmful to your physical health, your emotional well-being, and your relationships. Because you’re reporting significant anger problems, we urge you to seek face-to-face care with a healthcare provider. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>Difficulty controlling anger can be accompanied by depression, life stress, and post-traumatic stress. Anger can cause relationship problems and interfere with job performance. A good way to determine if you’re having problems in these other areas is to take additional assessments. </p> <p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const MaritalSatisfactionList: ScoringInterface[] = [];


const MaritalSatisfactionScoring15 = makeScoring(16,100,158,'HIGH',
                                    `<p>Your score is in a range typically associated with high marital distress.</p><p>Your response indicated that you are experiencing problems with your spouse in a variety of areas leading to a great deal of distress in your marital relationship.</p>`,
                                    `<p>Having experiences of marital distress suggests that you should look into these concerns because they can be very upsetting and disruptive of your life.  We encourage you to check out the resources in the "Families and Friendships" topic. You will find information and exercises for developing skills and strategies that can help improve your marriage.</p><p>In addition to the materials on AfterDeployment, you may benefit from discussing your marriage with a healthcare provider. You can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of this page. If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of this page. Both the CALL and CHAT options are available 24/7.</p><p> We recommend that you retake the Marital Relationships assessment in a month to see how you are doing. If over time you find that problems aren’t improving, consult a professional. AfterDeployment is not a substitute for face to face support.</p><p>Problems may also be present in other areas of life. A good way to determine if you’re having problems in other areas is to take additional assessments.</p><p>For your convenience, you can find links to the tools that were mentioned here through the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const MaritalSatisfactionScoring16 = makeScoring(17,85,99,'MOD',
                                    `<p>Your score is in a range typically associated with some marital distress.</p><p>Your responses suggest that you have some dissatisfaction with your marital relationship based on the presence of conflict or disagreement.</p>`,
                                    `<p>Having some experiences of marital distress suggests that you should look into these concerns because they can become very upsetting and disruptive of your life if left unresolved.  We encourage you to check out the resources in the "Families and Friendships" topic. You will find information and exercises for developing skills and strategies that can help improve your marriage.</p><p>In addition to the materials on AfterDeployment, you may benefit from discussing your marriage with a healthcare provider. You can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of this page. If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of this page. Both the CALL and CHAT options are available 24/7.</p><p> We recommend that you retake the Marital Relationships assessment in a month to see how you are doing. If over time you find that problems aren’t improving, consult a professional. AfterDeployment is not a substitute for face to face support.</p><p>When there are marital difficulties present, problems are often present in other areas of life. A good way to determine if you’re having problems in other areas is to take additional assessments.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const MaritalSatisfactionScoring17 = makeScoring(18,0,84,'LOW',
                                    `<p>Your score is in a range typically associated with good marital satisfaction.</p><p>Your responses suggest that you are feeling satisfied with your marriage.</p>`,
                                    `<p>Your results suggest you are managing this area of your life.  Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” program.</p><p>You’re also encouraged to check out other assessments on AfterDeployment as they can be helpful for learning more about whether or not you are having problems in other areas.  For your convenience, you can find links to the tools that were mentioned here through the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const FriendshipScaleList: ScoringInterface[] = [];


const FriendshipScaleScoring18 = makeScoring(19,0,15,'LOW',
                                    `<p>Your score is in a range reflecting few problems with social connections.</p>  <p>Your responses suggest that you’re socially connected and do not feel isolated from others. </p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const FriendshipScaleScoring19 = makeScoring(20,16,18,'MOD',
                                    `<p>Your score is in a range typically associated with some social support.<p>  <p>Your responses suggest that you have some social support but perhaps not as much as you would like, which may be causing you to feel isolated. </p>`,
                                    `<p>After a stressful experience, some people withdraw from friends and family and from activities. However, caring and encouragement from others can boost health and well-being. People who feel connected are less likely to be depressed and are more likely to live longer. We encourage you to check out <i>AfterDeployment</i>'s materials in the "Families and Friendships" topic.   In addition to the materials on AfterDeployment, you may benefit from discussing your feelings of isolation with a health care provider. If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p>><p>Another way to explore these experiences is to check out the materials in AfterDeployment’s “Families and Friendships” topic.</p> <p>When someone is experiencing these kinds of concerns, problems may be present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const FriendshipScaleScoring20 = makeScoring(21,19,24,'HIGH',
                                    `<p>Your score is in a range typically associated with low social support, and suggests that you do not feel socially connected or supported by the people in your life. </p>`,
                                    `<p>After a stressful experience, some people withdraw from friends and family and from activities. However, caring and encouragement from others can boost health and well-being. People who feel connected are less likely to be depressed and are more likely to live longer.  Because you’re reporting a low level of social support, we encourage you to meet with a health care provider. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Families and Friendships” topic.</p><p>Social isolation can occur alongside problems in relationships, life stress, depression, and post-traumatic stress, the reaction that many people experience after a major trauma. A good way to determine if you’re having problems in these areas is to take additional assessments. We also suggest that you complete the Friendship Scale again in a month to track how you’re doing.</p> <p>You can find links to these tools under the RESOURCES tab located above</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const OptimismList: ScoringInterface[] = [];


const OptimismScoring21 = makeScoring(22,0,13,'LOW',
                                    `<p>Your score is in a range typically associated with a low level of Optimism.</p><p>You describe yourself as someone who finds it difficult to believe that positive things are likely to occur in the future.</p>`,
                                    `<p>Your score suggests that you tend to expect negative outcomes when you are confronted with uncertainty.   Given any event that could hold either positive or negative meaning, you are likely to choose the negative interpretation.   This is a habit that can be broken.  Research suggests that the act of regularly interpreting events in a positive light leads to an increase in health and well-being over time and is protective against depression.  An optimistic perspective also increases the development and maintenance of healthy relationships which are an important part of building resilience.   Realistic optimism is not the same thing as being naïve or being in denial.  It recognizes that in looking at the world there are frequently a wide range of possible meanings associated with a particular event, all of which have a reasonable chance of describing reality.  Optimists tend to select the meaning that describes positive outcomes and contribute to their own well-being.</p><p>If you find that your tendency to expect the worst and to regularly give negative meaning to events is interfering with your ability to enjoy life or try new things,  you may benefit by meeting with a cognitive therapist. A therapist can help you recognize and change negative interpretation of events. you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>When someone wishes to increase their realistic optimism, exploring other areas of life can help.  You can do more exploration  by taking additional assessments.  We also encourage you to check out AfterDeployment’s "Resilience" topic.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const OptimismScoring22 = makeScoring(23,14,18,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate level of Optimism.</p><p>You describe yourself as someone who is generally optimistic about life, but with some reservations.</p>`,
                                    `<p>Your score suggests that you somewhat positive about the future, but not completely.  Research suggests that maintaining a realistically optimistic perspective leads to an increase in health and well-being over time and is protective against physical illness and emotional struggles.  Realistic optimism also increases the development and maintenance of healthy relationships which are an important part of building resilience.  Realistic optimism is not the same thing as being naïve or being in denial.  It recognizes that in looking at the world there are frequently a wide range of possible meanings associated with a particular event, all of which have a reasonable chance of describing reality.  Optimists tend to select the meaning that describes positive outcomes and contribute to their own well-being.</p><p>If you’d like to enhance your sense of optimism, try surrounding yourself with positive people, like those who tend to volunteer with service organizations.  If you find that you have become less optimistic lately, you might consider meeting with a cognitive therapist who can help you evaluate and change how you interpret events. If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When someone wishes to increase their optimism, exploring other areas of life can help.  You can do more exploration  by taking additional assessments.  We also encourage you to check out AfterDeployment’s "Resilience" topic. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const OptimismScoring23 = makeScoring(24,19,24,'HIGH',
                                    `<p>Your score is in a range typically associated with a high degree of optimism.</p><p>Your results suggest that your expectations for the future are very positive.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics.  </p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p>`
                                    );


const ParentingConfidenceList: ScoringInterface[] = [];


const ParentingConfidenceScoring24 = makeScoring(25,0,50,'LOW',
                                    `<p>Your score is in a range typically associated with a significant lack of confidence and satisfaction in your role as a parent.  You describe yourself as someone who is experiencing conflict in this role.</p>`,
                                    `<p>There are many reasons that can contribute to feeling a lack of confidence or satisfaction as a parent.   You may feel like you have little support  or it may be that you have particularly challenging kids.   Many parents struggle with handling the demands of parenting, but it is possible to develop increased confidence and satisfaction by consulting with experts in the field.  If you would like personal support in developing more confidence you can speak with a professional who can provide guidance in this area.  You can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of this page.  If you have other personal concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of this page. Both the CALL and CHAT options are available 24-7.</p><p>When someone wishes to grow in their role as a parent, exploring other areas of life can help.  You can do more exploration by taking additional assessments. We also encourage you to check out AfterDeployment’s Families with Kids materials. You can find links to the tools that were mentioned here through the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const ParentingConfidenceScoring25 = makeScoring(26,51,69,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate level of confidence and satisfaction in your role as a parent.</p>`,
                                    `<p>Your score suggests that for the most part, you believe you handle your role as a parent well but  you also identify some challenges with satisfaction or confidence as a parent.</p><p>Parenting is full of challenges and it is normal to feel unsure or dissatisfied on occasion.  If you would like support or guidance in increasing your confidence as a parent, there are providers who specialize in helping parents develop increased confidence.  If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When someone wishes to grow in their role as a parent, exploring other areas of life can help.  You can do more exploration by taking additional assessments.  We also encourage you to check out AfterDeployment’s "Families with Kids" topic. <p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const ParentingConfidenceScoring26 = makeScoring(27,70,96,'HIGH',
                                    `<p>Your score is in a range indicating that you very confident and satisfied with how you are handling your role as a parent.</p>`,
                                    `<p>Because maintaining healthy habits means a lifestyle that includes many stress management tools to help find balance, we encourage you to check out the many tools in the “Life Stress” program.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const PerceivedSocialSupportList: ScoringInterface[] = [];


const PerceivedSocialSupportScoring27 = makeScoring(28,0,48,'LOW',
                                    `<p>Your score is in a range typically associated with low social support.</p>  <p>Your responses indicate that you are not feeling helped and supported by the important people in your life. You don’t have a lot of people to count on in difficult times. This can leave you feeling overwhelmed. Help and encouragement from others is important to your physical and emotional health and well-being. </p>`,
                                    `<p>Having experiences such as you have identified suggests that you should look into these concerns and discuss your sense of isolation with a counselor or therapist.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>When someone is experiencing the kinds of distressing concerns you report, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p>We recommend that you take this assessment again in two to four weeks to track how you are doing. We also encourage you to check out AfterDeployment's “Families and Friendships” materials. However, we want to emphasize that your responses on the assessment indicate that your best plan is to consult with a counselor or therapist. AfterDeployment is not a substitute for consulting with a provider in person.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PerceivedSocialSupportScoring28 = makeScoring(29,49,68,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate level of social support.</p>  <p>Your responses indicate that you have people in your life who are there when you need them. However, you may feel that you could use more support from some of the important people in your life. Help and encouragement from others is important to your physical and emotional health and well-being. </p>`,
                                    `<p>When someone experiences insufficient social support, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. We also encourage you to check out the information in the "Families and Friendships" topic to find out more about these problems and what you can do about them. You will find information and activities on how to increase levels of social support.</p><p>You may benefit from discussing your need for increased social support with a counselor or therapist. If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>We recommend that you retake this assessment in two to four weeks to track how you are doing.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PerceivedSocialSupportScoring29 = makeScoring(30,69,84,'HIGH',
                                    `<p>Your score is in a range typically associated with high levels of social support.</p>  <p>Your responses suggest that you have support and help from family and friends.  You have people there when you need them. </p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const ResilienceList: ScoringInterface[] = [];


const ResilienceScoring30 = makeScoring(31,0,49,'LOW',
                                    `<p>Your score is in a range that indicates that you are not regularly using many of the resilience skills that are available to help you to cope with life’s stressful events.</p>`,
                                    `<p>Your score suggests that there are a number of resilience skills that you are not currently using that have the potential to significantly improve how you respond to life’s stressors.  It might be useful to review your responses to this assessment and identify  the coping strategies you are not using to cope with stress.  You can then begin to practice those additional resilience skills.  If you’d like to work with a professional to increase your ability to successfully respond to stressful life events, you may benefit by talking with a therapist who is skilled in cognitive therapy. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Resilience” topic. Also, when someone is learning resilience skills, exploring other areas of life can help.  You can do more exploration by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const ResilienceScoring31 = makeScoring(32,50,70,'MOD',
                                    `<p>Your score is in a range that indicates that while you use many of the resilience skills available to you, you do not use them as consistently as you could to cope with life’s stressful events.</p>`,
                                    `<p>Your score suggests that you are familiar with and use resilience skills when you have to deal with stressful events.  Consider working on using them more consistently.  Review your responses to identify coping strategies you do not use on a regular basis to cope with stress, and begin to practice those skills.  If you’d like to work with a professional to increase your ability to successfully respond to stressful life events, you may benefit by talking with a therapist who is skilled in cognitive therapy. .  If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When someone is learning resilience skills, exploring other areas of life can help.  Explore these by taking additional assessments.  We also encourage you to check out AfterDeployment’s "Resilience" topic. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const ResilienceScoring32 = makeScoring(33,71,88,'HIGH',
                                    `<p>Your score is in a range that indicates that you use many of the skills that have been found to be useful in coping with life’s stressful events.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a following lifestyle that includes a wide range of stress management strategies, we encourage you to check out the additional tools in the “Life Stress” program.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn more about yourself in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const StigmaList: ScoringInterface[] = [];


const StigmaScoring33 = makeScoring(34,0,22,'LOW',
                                    `<p>Your results indicate that you are comfortable with the idea of seeking psychological treatment. </p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in some areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const StigmaScoring34 = makeScoring(35,23,32,'MOD',
                                    `<p>Your results indicate that you are somewhat uncomfortable with the idea of seeking psychological treatment.</p>`,
                                    `<p>Discomfort with the idea of seeking psychological treatment for problems in living is not unusual.  Reluctance to meet with a mental health professional however is often the result of a lack of information or misinformation about the treatment process.  Counseling, psychotherapy, and medication management are now based on research and have been shown to be very effective for a wide range of psychological health issues from depression to relationship problems.  Failure to get needed treatment for the effects of stress or other issues can lead to increasing problems with your physical health, your emotional well-being, and your relationships.  If you are experiencing depression, anxiety, or other psychological distress, you need to get help.  Start with your physician or clergy.</p><p>You can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>We also encourage you to check out AfterDeployment’s "Stigma" topic.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const StigmaScoring35 = makeScoring(36,33,50,'HIGH',
                                    `<P>Your results indicate that you are highly uncomfortable with the idea of seeking psychological treatment. </p>`,
                                    `<p>Discomfort with the idea of seeking psychological treatment for problems in living is not unusual.  Reluctance to meet with a mental health professional however is often the result of a lack of information or misinformation about the treatment process.  Counseling, psychotherapy, and medication management are now based on research and have been shown to be very effective for a wide range of psychological health issues from depression to relationship problems.  Failure to get needed treatment for the effects of stress or other issues can lead to increasing problems with your physical health, your emotional well-being, and your relationships.  If you are experiencing depression, anxiety, or other psychological distress, you need to get help.  Start with your physician or clergy. You can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We also encourage you to check out the materials in AfterDeployment’s "Stigma" topic.</p><p>If you are concerned about seeking psychological treatment, you may wish to explore the kinds of problems that may be  present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const StressList: ScoringInterface[] = [];


const StressScoring36 = makeScoring(37,0,10,'LOW',
                                    `<p>Your score is in a range typically associated with low stress.</p><p>Your responses suggest that you feel very much in control of your life at the moment.  Your low level of stress suggests that you are either not experiencing significant challenges at this point in your life or that your coping skills are acting to protect you from stress.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const StressScoring37 = makeScoring(38,11,25,'MOD',
                                    `<p>Your score is in a range typically associated with moderate stress.</p><p>Your responses suggest you are experiencing some stress right now. If you are feeling overwhelmed,  that may affect your general well-being.</p>`,
                                    `<p>We encourage you to check out the materials in AfterDeployment’s "Life Stress" topic to find information and exercises about how to deal with stressful life events.  We want to emphasize  that while this website is here to provide information and support, AfterDeployment is not a substitute for consulting a health care provider.  If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When someone is struggling with stressful experiences, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const StressScoring38 = makeScoring(39,26,40,'HIGH',
                                    `<p>Your responses suggest that you are experiencing a high level of stress.  You feel overwhelmed, like things are out of control.  And, this level of stress is affecting your general well-being.</p>`,
                                    `<p>You have described experiencing symptoms associated with a significant amount of stress.  If you are not currently seeking help, we strongly recommend that you see your primary care doctor or other healthcare professional.  Take a copy of your assessment results with you to share with your provider.  A provider can help target the specific problems you might be having and will help develop a plan to help you feel better.</p>.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>When someone is struggling with stressful experiences, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const WorkAdjustmentList: ScoringInterface[] = [];


const WorkAdjustmentScoring39 = makeScoring(40,0,24,'LOW',
                                    `<p>Your results indicate that you feel little control over your ability to manage the challenges of your work environment.</p>`,
                                    `<p>One of the key elements associated with satisfaction and happiness on the job is your belief in your ability to manage the challenges presented by your  job and the people you work with.  Your results indicate that you have very little confidence that you can successfully handle the problems you confront at work.  This may be the result of an unreasonable supervisor, co-worker or something else beyond your control.  You may need to be more assertive or need more job training. Perhaps you simply aren’t happy doing the things required by your job.  It's important to gain a sense of control over your ability to manage the challenges at work.</p> <p>It may help for you to speak with a professional counselor or vocational counselor. You can locate a professional near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment. You can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p> <p>When people lack confidence in their ability to solve  problems at work, there are often problems present in other areas of life.  You can find out more about yourself  by taking additional assessments. We also encourage you to check out the materials in AfterDeployment’s "Work Adjustment" topic.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const WorkAdjustmentScoring40 = makeScoring(41,25,34,'MOD',
                                    `<p>Your results indicate that you are moderately satisfied with your ability to manage the challenges of your work environment.</p>`,
                                    `<p>One of the key elements associated with satisfaction and happiness on the job is your belief in your ability to manage the challenges presented by your  job and the people you work with.  Your results indicate that you are not completely confidence that you can successfully handle the problems you confront at work.  This may be the result of an unreasonable supervisor, co-worker or something else beyond your control.  You may need to be more assertive or need more job training. Perhaps you simply aren’t happy doing the things required by your job.  It's important to gain a sense of control over your ability to manage the challenges at work.</p> <p>It may help for you to speak with a professional counselor or vocational counselor. You can locate a professional near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment. You can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p> <p>When people lack confidence in their ability to solve  problems at work, there are often problems present in other areas of life.  You can find out more about yourself  by taking additional assessments. We also encourage you to check out the materials in AfterDeployment’s "Work Adjustment" topic.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const WorkAdjustmentScoring41 = makeScoring(42,35,40,'HIGH',
                                    `<P>Your results indicate that you feel very confident in your ability to manage the challenges and demands of your work environment.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const HopeList: ScoringInterface[] = [];


const HopeScoring42 = makeScoring(43,0,16,'LOW',
                                    `<p>When compared to others, your hopefulness score is significantly below average. Your responses indicate that you’re not feeling very optimistic or hopeful, you’re not satisfied with your accomplishments, and you’re not feeling confident about achieving your future goals.</p>`,
                                    `<p>A loss of hopefulness or optimism about the future can be common following a stressful experience. Optimism can protect you from depression and the negative effects of stress, and contribute to increased happiness and health.  While only a healthcare provider can make an actual diagnosis, a lack of hopefulness or optimism is often related to depression and post-traumatic stress similar to what many people experience after a major trauma. The materials on AfterDeployment may be helpful. We also urge you to discuss your situation with a health care provider.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Depression” topic. Also, when someone is experiencing the kinds of distressing concerns you report, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p> <p>We recommend that you complete this assessment again in two to four weeks to track how you're doing. </p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const HopeScoring43 = makeScoring(44,17,23,'MOD',
                                    `<p>When compared to others, your hopefulness score is below average. </p>  <p>While your responses indicate that you're somewhat hopeful, they also suggest that you’re guardedly optimistic, and that you may be dwelling on earlier goals and not feeling convinced about your ability to face challenges.</p>`,
                                    `<p>A loss of hopefulness or optimism about the future can be common following a stressful experience. The materials on AfterDeployment may be helpful. You may also find it helpful to discuss your concerns with a healthcare provider.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p>When someone is experiencing these kinds of  concerns, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments.   </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const HopeScoring44 = makeScoring(45,24,32,'HIGH',
                                    `<P>Your score is in a range typically associated with a hopeful outlook on life.</p>`,
                                    `<p>Your responses suggest that you're hopeful and optimistic about your ability to get things done, and can work to achieve your goals with skill and enthusiasm.</p>  Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const GenerosityList: ScoringInterface[] = [];


const GenerosityScoring45 = makeScoring(46,0,46,'LOW',
                                    `<p>Your score is in a range typically associated with a low level of interpersonal Generosity.  You describe yourself as someone who tends not to be available for other people, and who tends to hold back when it comes to extending personal resources to others, completely and unselfishly.</p>`,
                                    `<p>Your score suggests that you do not tend to be generous on the interpersonal level.  This might be because you simply don’t have the desire or interest to reach out to others on a personal level, or like many people, you may be shy or find it difficult to get involved with others.  You may show generosity in other ways,by donating money for example.  Research suggests that only interpersonal generosity has a positive affect on the giver’s health and well-being.  It also promotes the development and maintenance of healthy relationships which are an important part of building resilience.  If you would like personal support in developing a more reflexive generosity toward others, many spiritual traditions encourage interpersonal generosity.  You can locate a church, synagogue or other spiritual organization near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p> <p>We encourage you to check out the materials in AfterDeployment’s "Resilience" topic. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const GenerosityScoring46 = makeScoring(47,47,56,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate level of Interpersonal Generosity. You describe yourself as someone who is available for other people, but who tends to hold back somewhat when it comes to extending personal resources to others, completely and unselfishly.</p>`,
                                    `<p>Your score suggests that you give of yourself to others in terms of your attention, emotions, and energy, but not wholeheartedly.  You tend to hold back to some degree.  This might be because you are cautious or shy, or that you don’t always attend to the needs of others.  Research suggests that the act of giving of yourself to others leads to an increase in health and well-being over time.  It also increases the development and maintenance of healthy relationships which are an important part of building resilience.  If you would like personal support in developing a more reflexive generosity toward others, many spiritual traditions encourage interpersonal generosity.  You can locate a church, synagogue or other spiritual organization near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>We  encourage you to check out the materials in AfterDeployment’s "Resilience" topic.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const GenerosityScoring47 = makeScoring(48,57,60,'HIGH',
                                    `<p>Your score is in a range typically associated with a high degree of interpersonal generosity. Your results suggest that you regularly give of your attention, emotions, and energy to others on a personal level.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const AlcoholDrugsList: ScoringInterface[] = [];


const AlcoholDrugsScoring48 = makeScoring(49,0,14,'LOW',
                                    `<p>Your score is in a range typically associated with no or low alcohol or drug use. </p> <p>Although only a healthcare professional can diagnose a substance abuse problem, your results suggest that your health may not be at risk from alcohol or drug use.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic. </p> <p> It’s important to emphasize that the abuse of any drug – whether prescribed, over-the-counter, or illegal substances – can lead to health, legal, and relationship problems.</p>  <p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above. </p> <p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const AlcoholDrugsScoring49 = makeScoring(50,15,29,'MOD',
                                    `<p>Your score is in a range typically associated with <u>moderate</u> alcohol use.</p> <p>Although only a healthcare professional can diagnose a substance abuse problem, your results suggest that your health may not be at risk from alcohol or drug use.</p>`,
                                    `<p>After a stressful experience, some people turn to drinking to mask painful feelings. But drinking neither solves problems nor fixes painful emotions. In fact, just the opposite is true.  Drinking is much more likely to <u>worsen</u> rather than improve your level of stress.  Out-of-control drinking can often be accompanied by depression, life stress, and even post-traumatic stress, the reaction that many people experience after a major trauma. One easy way to determine if you're having problems in other areas is to take additional assessments.</p><p>We also encourage you to check out the materials in AfterDeployment's "Alcohol and drugs" topic.</p><p>You may benefit from discussing your alcohol use with a health care provider.  You can <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab tab in the upper right corner of the website. We suggest that you share the results of this assessment with your provider. If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website.  Both the CALL and CHAT options are available 24/7.  For your convenience, you can find links to the all of the tools that were mentioned here through the RESOURCES tab <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tabd above. </p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const AlcoholDrugsScoring50 = makeScoring(51,30,40,'HIGH',
                                    `<p>Your score is in a range typically associated with <u>high</u> levels of alcohol use.</p> <p>Although only a healthcare professional can diagnose a substance abuse problem, your responses are consistent with someone who has become dependent on alcohol, indicating that you’re at high risk for severe problems, including health, social, financial, legal, and relationship difficulties.</p>`,
                                    `<p>After a stressful experience, some people turn to drinking to mask painful feelings. But drinking neither solves problems nor fixes painful emotions. In fact, just the opposite: drinking is much more likely to worsen your stress.   Because your level of use suggests that you have become dependent on alcohol, you should not attempt to quit or decrease your alcohol use on your own.  Suddenly discontinuing heavy alcohol use can be dangerous.  Because you’re reporting significant alcohol use, we recommend that you seek face-to-face care with a professional.  A medical or mental health provider can evaluate the extent of the problem and develop a plan. Take a copy of your assessment results with you. You can <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab tab in the upper right corner of the main page. If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page. Both the CALL and CHAT options are available 24/7.</p>  <p>Out-of-control drinking can be accompanied by depression, life stress, and even post-traumatic stress, the reaction that many people experience after a major trauma. A good way to determine if you’re having problems in these other areas is to take additional assessments. We also suggest that you complete the alcohol and drug assessment again in three months and compare your assessment results with today’s results.</p>  <p>We encourage you to check out the materials in AfterDeployment's "Alcohol and Drugs" topic. However, we want to emphasize that your responses  indicate that your best plan is to consult with a health care provider. AfterDeployment is not a substitute for consulting with a provider in person.</p> <p>You can find links to these tools under the RESOURCES tab <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tabd above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const AnxietyList: ScoringInterface[] = [];


const AnxietyScoring55 = makeScoring(56,0,5,'LOW',
                                    `<p>Your score is in a range typically associated with a low level of anxiety indicating that anxiety is probably not affecting your life.</p><p>Although only a healthcare professional can provide an actual diagnosis of an anxiety disorder, your results suggest that you are not experiencing the classic physical or cognitive symptoms associated with anxiety.</p>`,
                                    `<p> Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress”   topic.</p><p>You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics.  </p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p>`
                                    );



const AnxietyScoring56 = makeScoring(57,6,10,'MOD',
                                    `<p>Your score is in a range typically associated with  moderate levels of the physical and cognitive symptoms of anxiety.  Although only a healthcare professional can provide an actual diagnosis, your responses suggest that the symptoms you describe may be associated with the changes that occur in the body in response to anxious concerns.</p>`,
                                    `<p>A moderate degree of anxiety typically doesn’t cause significant distress but is a sign to begin to pay attention to your level of worry.  Worry causes an increase in the level of vigilance and physical arousal, energy that could be better used focusing on positive things in life.  If your anxiety symptoms have increased recently  it may be useful to discuss this with your  health care provider.   You can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.   If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24/7.</p><p>When someone is worrying unnecessarily, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const AnxietyScoring57 = makeScoring(58,11,21,'HIGH',
                                    `<p>Your score is in a range typically associated with a significant level of physical and cognitive symptoms of anxiety.</p><p>Although only a healthcare professional can provide an actual diagnosis, these symptoms may be causing you significant distress.</p>`,
                                    `<p>The physical symptoms of anxiety are frequently experienced during deployment because of the need for a constant level of vigilance.  But high levels of anxiety that persist after deployment, when high vigilance is not required,  can be harmful to your physical health, and your emotional well-being. The cognitive and physical symptoms you are reporting  are frequently associated with high levels of anxiety, but they may also indicate a physical illness.   We urge you to seek face-to-face care with a healthcare provider.If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24/7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Anxiety” topic. Also, when someone is experiencing multiple symptoms of anxiety, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const SleepList: ScoringInterface[] = [];


const SleepScoring58 = makeScoring(59,0,0,'LOW',
                                    `<p>Your responses suggest that you are not having problems with your sleep. Good sleep patterns are important for your health, mood, and productivity. </p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p>`
                                    );



const SleepScoring59 = makeScoring(60,1,2,'MOD',
                                    `<p>Your responses suggest that you are having some difficulty with sleeping and that your sleep is not as good as you’d like. </p>  <p>You report having one or two sleep problems and depending on how severe these problems are, you may be having significant difficulties with your functioning. Sleep problems need to be taken seriously. Good sleep patterns are important for your health, mood, and productivity. </p>`,
                                    `<p>We encourage you to check out the resources in the Sleep program on AfterDeployment to find out more about these problems and what you can do about them. You will find information and activities on how to manage issues with sleep and develop healthy sleep patterns. And, we would recommend that you retake this sleep assessment in 2-4 weeks to track how you are doing. We want to emphasize that while this website is here to provide information and support, AfterDeployment is not a substitute for consulting with a health care provider in person.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore these experiences is to check out the materials in AfterDeployment’s “Sleep” topic. When someone is struggling with difficulty sleeping, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const SleepScoring60 = makeScoring(61,3,10,'HIGH',
                                    `<p>Your score is in a range typically associated with significant sleep problems.</p>  <p>Sleep problems need to be taken seriously as chronic sleep problems are bad for your physical and emotional health, your relationships, and your productivity.</p>`,
                                    `<p>A variety of physical health problems may be related to sleep difficulty. Sleep problems may be related to problems such as stress, depression, post traumatic stress and substance abuse. Because you are reporting significant sleep problems, we recommend that you seek face-to-face care with a healthcare provider. A medical or mental health provider can evaluate what is going on and help develop a plan to address your sleep problems. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Sleep” topic. Also, when someone is experiencing the kinds of sleep concerns you report, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const CaregiverStressList: ScoringInterface[] = [];


const CaregiverStressScoring61 = makeScoring(62,1,2,'LOW',
                                    `<p>Your score is in a range typically associated with low caregiver stress.</p>  <p>Your responses suggest that you’re taking care of yourself and dealing well with the stress of care giving. </p>`,
                                    `<p>Even though you're not reporting caregiver stress, maintaining healthy habits means a lifestyle that includes stress management and finding balance. You may find helpful tools in the “Life Stress” and "Health and Wellness" topics.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const CaregiverStressScoring62 = makeScoring(63,3,4,'MOD',
                                    `<p>Your score is in a range typically associated with moderate stress.</p>  <p>Based on your responses, you’re experiencing some stress in your role as a caregiver right now, and may be feeling somewhat overwhelmed by current demands. </p>`,
                                    `<p>There are many things in the life of a caregiver that can lead to feeling stressed. Caring for others is best accomplished by those who also make time for themselves. Consider whether you need to have some relief from your role as a caregiver. If you’re feeling resentment because you can’t seem to ask others for help, or because you believe that you must do everything yourself, talk with a healthcare professional. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore these experiences is to check out the materials in AfterDeployment’s “Life Stress” topic. The stress of being a caregiver can be accompanied by problems in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const CaregiverStressScoring63 = makeScoring(64,5,6,'HIGH',
                                    `<p>Your score is in a range typically associated with high caregiver stress.</p>  <p>Based on your results, you’re experiencing a high level of distress in your role as a caregiver, which may be taking an emotional and physical toll. </p>`,
                                    `<p>There are many things in the life of a caregiver that can lead to feeling stressed. High stress can cause a variety of health problems, such as sleep difficulties, headaches, and gastrointestinal problems. Caring for others is best accomplished by those who also make time for themselves. Consider whether you need to have some relief from your role as a caregiver. If you’re feeling resentment because you can’t seem to ask others for help, or because you believe that you must do everything yourself, talk with a healthcare professional. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore these experiences is to check out the materials in AfterDeployment’s “Life Stress” topic. The stress of being a caregiver can be accompanied by problems in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments..</p> <p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const ForgivenessList: ScoringInterface[] = [];


const ForgivenessScoring64 = makeScoring(65,0,54,'LOW',
                                    `<p>Your score is in a range typically associated with a tendency to be unforgiving of yourself, others, or negative, uncontrollable  circumstances or  events like illness or natural catastrophes.</p><p>You describe yourself as unforgiving  when you are confronted with situations in life you consider to be unfair, or when you feel you have been hurt by others.  You also find it difficult to forgive yourself for past behaviors.</p>`,
                                    `<p><p>Your score suggests that you do not tend to be forgiving.  This might be because you have a basic desire to forgive, but like many people, find it difficult to do at certain times or under some circumstances.  Research suggests that holding on to negative feelings over the long run can have a negative effect on health and well-being.  It also interferes with developing and maintaining healthy relationships which are an important part of building resilience.    If you find that you are holding grudges, resentment or anger directed at yourself, someone else, or a circumstance that doesn’t seem fair, you may benefit by talking with an advisor associated with your spiritual tradition or with a therapist.   You can locate a provider, church, or synagogue near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>When someone is learning to be more forgiving, exploring other areas of life can help.  You can do more exploration  by taking additional assessments. We also encourage you to check out AfterDeployment’s Resilience materials. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const ForgivenessScoring65 = makeScoring(66,55,89,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate tendency to forgive yourself, others, and negative circumstances, events, or situations that are beyond anyone’s control.</p><p>You tend to be about equally as likely to forgive as not to forgive yourself, others or negative, uncontrollable  circumstances or  events like illness or natural catastrophes.</p>`,
                                    `<p>Your score suggests that you may find it easier to forgive in some situations or at some times than in others.  This might be because you have a basic desire to forgive, but like many people, find it difficult to do at certain times or under some circumstances.  Research suggests that holding on to negative feelings over the long run can have a negative effect on health and well-being.  It also interferes with developing and maintaining healthy relationships which are an important part of building resilience.    If you find that you are holding grudges, resentment or anger directed at yourself, someone else, or a circumstance that doesn’t seem fair, you may benefit by talking with an advisor associated with your spiritual tradition or with a therapist.   You can locate a provider, church, or synagogue near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>When someone is learning to be more forgiving, exploring other areas of life can help.  You can do more exploration  by taking additional assessments. We also encourage you to check out AfterDeployment’s Resilience materials.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const ForgivenessScoring66 = makeScoring(67,90,126,'HIGH',
                                    `<p>Your score is in a range typically associated with a strong tendency to forgive others, yourself, and negative circumstances, events, or situations that are beyond anyone’s control.</p><p>Your results suggest that you tend to transform your responses to transgression,hurt, betrayal or disappointment from negative and potentially toxic, to neutral or even positive responses.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const GratitudeList: ScoringInterface[] = [];


const GratitudeScoring67 = makeScoring(68,0,35,'LOW',
                                    `<p>Your score is in a range typically associated with a low level of Gratitude.</p><p>You describe yourself as someone who has a restricted sense of gratitude for the positive elements in life, but may focus instead on life’s hurts and disappointments.</p>`,
                                    `<p>Your score suggests that while you are thankful for some things in life, you have reservations about wholeheartedly describing yourself as grateful.   This might be because you simply haven’t spent much time thinking about gratitude or perhaps you are holding on to hurts or disappointments from the past.   Research suggests that the act of recognizing and focusing on even small things you are grateful for leads to an increase in health and well-being over time and is protective against depression.  Many people find that what were initially thought to be negative events, on reflection, held a lesson for which they could be grateful.  Gratitude also increases the development and maintenance of healthy relationships which are an important part of building resilience.  If you would like personal support in recognizing things in life for which to be grateful, many spiritual traditions encourage gratitude.  You can locate a church, synagogue or other spiritual organization near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const GratitudeScoring68 = makeScoring(69,36,40,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate level of Gratitude.</p><p>You describe yourself as someone who is generally thankful for your experiences in life, but with some bit of reservation.</p>`,
                                    `<p>Your score suggests that you experience gratitude for a number of things in your life, but you have qualified your wholehearted endorsement of all of the gratitude questions.  Research suggests that the act of recognizing and focusing on what you are grateful for leads to an increase in health and well-being over time and is protective against depression.  Gratitude also increases the development and maintenance of healthy relationships which are an important part of building resilience.  Many people find that what were initially thought to be negative events, on reflection, held a lesson  for which they could be grateful.  If you would like personal support in increasing your sense of gratitude to an even higher level, many spiritual traditions encourage gratitude.  You can locate a church, synagogue or other spiritual organization near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>When someone wishes to increase their sense of gratitude, exploring other areas of life can help.  You can do more exploration  by taking additional assessments. We also encourage you to check out AfterDeployment’s Resilience materials.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const GratitudeScoring69 = makeScoring(70,41,42,'HIGH',
                                    `<p>Your score is in a range typically associated with a high degree of gratitude.</p><p>Your results suggest that you have been able to identify a number of people and experiences in life for which you are especially grateful.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const NicotineDependenceList: ScoringInterface[] = [];


const NicotineDependenceScoring70 = makeScoring(71,0,4,'LOW',
                                    `<p>Based on your reported smoking habits, your results indicate that you are not very dependent on nicotine at this point in time.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics.  </p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p>`
                                    );



const NicotineDependenceScoring71 = makeScoring(72,5,6,'MOD',
                                    `<p>Based on your reported smoking habits, your results indicate that you are moderately dependent on nicotine at this point in time. </p>`,
                                    `<p>Your reported smoking habits suggest that you have developed a moderate degree of dependence on nicotine. This means that you probably experience some degree of discomfort if your smoking habits are disrupted and that it is becoming increasingly difficult for you to quit.  If you would like to find medical or psychological support in your efforts to quit smoking, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore your tobacco use is to check out the materials in AfterDeployment’s “Tobacco” topic. When someone is struggling with nicotine dependence, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.   </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const NicotineDependenceScoring72 = makeScoring(73,7,10,'HIGH',
                                    `<p>Based on your reported smoking habits, your results indicate that you are highly dependent on nicotine at this point in time. </p>`,
                                    `<p>Your reported smoking habits suggest that you have developed a high  degree of dependence on nicotine. This means that you probably  experience discomfort if your smoking habits are disrupted and that it may be very difficult for you to quit.  You may find it especially useful to consult with a medical or psychological health care provider in your efforts to quit smoking. There are many medications and behavioral strategies available to help overcome your nicotine dependence.   You can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore your tobacco use is to check out the materials in AfterDeployment’s “Tobacco” topic. When someone is struggling with nicotine dependence, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.  Managing these kinds of concerns on your own can be difficult.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const PanicList: ScoringInterface[] = [];


const PanicScoring73 = makeScoring(74,0,20,'LOW',
                                    `<p>Your score is in a range NOT typically associated with the classic symptoms of panic attacks.</p>  <p>Although only a healthcare professional can provide an actual diagnosis of panic disorder, your results suggest that you are not experiencing the kinds of physical symptoms that usually define a significant problem with panic attacks.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PanicScoring74 = makeScoring(75,21,40,'MOD',
                                    `<p>Your score is in a range typically associated with  moderate levels of the physical symptoms associated with panic attacks.  Although only a healthcare professional can provide an actual diagnosis, you report some, but not all of the symptoms of actual panic disorder. </p>`,
                                    `<p>A moderate number of panic symptoms typically doesn’t cause significant, long term distress but is a sign to pay attention to how many demands you are juggling.  High stress levels cause  an increase in the level of vigilance and physical arousal.  If you’ve experienced an increase in these physical symptoms recently,   it may be useful to discuss this with your  health care provider. If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When someone is experiencing stress related symptoms,  problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.</p><p>We also encourage you to check out the materials in AfterDeployment's "Anxiety" topic. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PanicScoring75 = makeScoring(76,41,60,'HIGH',
                                    `<p>Your score is in a range typically associated with a significant level of physical symptoms associated with Panic Disorder.</p>  <p>Although only a healthcare professional can provide an actual diagnosis, these symptoms are probably causing you significant distress. </p>`,
                                    `<p>The physical symptoms of panic are frequently experienced during deployment when there is immediate danger and they are completely normal under those circumstances.   But high levels of panic symptoms that seem to come “out of the blue”, when there is no physical danger to confront,  can be frightening and upsetting. The cognitive and physical symptoms you are reporting  are frequently associated with high levels of chronic demands and life stress, but they may also indicate a physical illness.   We urge you to seek face-to-face care with a healthcare provider. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>When someone is experiencing symptoms of panic disorder,  problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. We also encourage you to check out the materials in AfterDeployment's "Anxiety" topic. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const PhysicalInjuryResilienceList: ScoringInterface[] = [];


const PhysicalInjuryResilienceScoring76 = makeScoring(77,0,49,'LOW',
                                    `<p>Your results indicate that you are not using many of the skills that could allow you to be more resilient in the face of the challenges that come with being injured.</p>`,
                                    `<p>The stress of coping with a physical injury can be significant.  You have indicated that you are not using many of the skills that can increase personal resilience in the face of an injury.  Your score suggests that there is a great deal more you can do in this area, by adding to your coping strategies or by using them more consistently.</p><p>If you’d like personal help in adding to your coping skills, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>When people are coping with the results of a physical injury, there are often problems present in other areas of life.  You can do more exploration by taking additional assessments. We also encourage you to check out the materials in AfterDeployment’s "Physical Injury" topic.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PhysicalInjuryResilienceScoring77 = makeScoring(78,50,70,'MOD',
                                    `<p>Your results indicate that you are using many of the skills that allow you to be resilient in the face of the challenges that come with being injured, but there may be additional skills you could develop to become even more resilient.</p>`,
                                    `<p>The stress of coping with a physical injury can be significant.  You have indicated that you are using several of the skills that can increase personal resilience in the face of an injury.  Your score suggests that there may be more you can do in this area, by adding to your coping strategies or by using them more consistently.</p><p>If you’d like personal help in adding to your coping skills, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p><p>When people are coping with the results of a physical injury, there are often problems present in other areas of life.  You can do more exploration by taking additional assessments.  We also encourage you to check out the materials in AfterDeployment’s "Physical Injury" topic.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PhysicalInjuryResilienceScoring78 = makeScoring(79,71,88,'HIGH',
                                    `<p>Your results indicate that you are using many of the skills that allow you to be resilient in coping with the stress that comes with being injured.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const PostDeploymentSocialSupportList: ScoringInterface[] = [];


const PostDeploymentSocialSupportScoring79 = makeScoring(80,0,39,'LOW',
                                    `<p>Your score is in a range typically associated with high social support following deployment.</p>  <p>Your responses suggest that you are satisfied with the social support that you have experienced following your deployment. </p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PostDeploymentSocialSupportScoring80 = makeScoring(81,40,59,'MOD',
                                    `<p>Your score is in a range typically associated with moderate social support following deployment.</p>  <p>Your responses suggest that you may not be completely satisfied with the support that you have received from your family, friends, or community since your return from deployment.</p>`,
                                    `<p>Emotional and practical support from family and community is helpful for service members, making the transition back home much easier. We encourage you to build support and make sure that you have others to turn to when you need them. If you are not finding what you need, you may want to consider looking for other supports in the military, veteran, or civilian community. </p><p>When someone has a problem with social support, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. We also encourage you to check out the materials in AfterDeployment's "Families and Friendships" and "Work Adjustment" topics to find out more about how to deal with difficulties in your personal and work relationships upon return from deployment. There, you will find information and strategies to help develop additional social support.</p><p>In addition to the materials on AfterDeployment, you may benefit from discussing social support with a healthcare provider. If you don’t have a provider, you can locate a provider or clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the website.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the website. Both the CALL and CHAT options are available 24-7.</p> <p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const PostDeploymentSocialSupportScoring81 = makeScoring(82,60,75,'HIGH',
                                    `<p>Your score is in a range typically associated with low social support following deployment.</p>  <p>Your responses suggest that you are not satisfied with the emotional or practical support that you have received from your family, friends, or community since your return from deployment. </p>`,
                                    `<p>If you are not currently seeking help, we strongly recommend that you discuss your sense of isolation with a counselor or therapist. Take a copy of your assessment results with you to share the details of your problem. A provider can help target the specific problems you might be having and will help develop a plan to improve your sense of connection to others. You can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p>  <p>When someone has a problem with social support, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments.</p>  <p>We also encourage you to check out the materials in AfterDeployment's "Families and Friendships" and "Work Adjustment" topics to find out more about how to deal with difficulties in relationships upon return from deployment. You will find information and strategies to help develop social supports.</p>  <p>Take a look at how comfortable you are with asking for support. You may find that you are giving people the message that you are OK and don't need or want support. It is a common mistake to believe that if you have to ask for support it means that people don’t care. Many people are more than happy to provide help and support if they understand the need. Remember that people can't read your mind.</p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const SatisfactionwithLifeList: ScoringInterface[] = [];


const SatisfactionwithLifeScoring82 = makeScoring(83,0,17,'LOW',
                                    `<p>Your results indicate that you experience a low level of satisfaction with your life and are significantly below average in your ratings of how satisfied you are with your life compared to others who have completed this scale. </p>`,
                                    `<p>Satisfaction with life can be based on many factors, including your physical health, work, relationships, and emotional health.  If you are aware of specific areas of your life that interfere with the direction you’d like your life to go, it’s important to develop a plan that allows you to develop a sense of control in those areas.  You may wish to lose weight, stop smoking or drinking, improve your eating habits, improve your relationships or look for more satisfying work.  Your low level of life satisfaction suggests you might benefit by seeking help in any of these areas that are interfering with your ability to enjoy life.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Health and Wellness” topic. Also, when someone is experiencing  concerns with how their life is progressing, problems are often present in many other areas.  You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const SatisfactionwithLifeScoring83 = makeScoring(84,18,29,'MOD',
                                    `<p>Your results indicate that you are moderately satisfied with your overall quality of life and are close to the average of others who have completed this scale.</p>`,
                                    `<p>Satisfaction with life can be based on many factors, including your physical health, work, relationships, and emotional health.  If you are aware of specific areas of your life that interfere with the direction you’d like your life to go, it’s important to develop a plan that allows you to develop a sense of control in those areas.  You may wish to lose weight, stop smoking or drinking, improve your eating habits, improve your relationships or look for more satisfying work.  Your low level of life satisfaction suggests you might benefit by seeking help in any of these areas that are interfering with your ability to enjoy life.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Health and Wellness” topic. Also, when someone is experiencing  concerns with how their life is progressing, problems are often present in many other areas.  You can determine where other problems may exist or the extent of the problem by taking additional assessments.  </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const SatisfactionwithLifeScoring84 = makeScoring(85,30,35,'HIGH',
                                    `<p>Your results indicate that you are feeling very satisfied with how your life is going at the present time.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means following a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const SexualTraumaList: ScoringInterface[] = [];


const SexualTraumaScoring85 = makeScoring(86,0,33,'LOW',
                                    `<p>Your score suggests that you are not experiencing symptoms that are typically associated with post-traumatic stress as a result of sexual trauma.</p><p>Although only a healthcare professional can provide an actual diagnosis of post-traumatic stress, or its absence, your results suggest that your experience is not similar to the experience of individuals suffering from post-traumatic stress.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. However, you may still find the material in the "Military Sexual Trauma" and "Life Stress" topics on AfterDeployment helpful. </p><p>You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics.  </p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p>`
                                    );



const SexualTraumaScoring86 = makeScoring(87,24,43,'MOD',
                                    `<p>Although only a healthcare professional can provide an actual diagnosis, you are reporting some experiences which are similar to symptoms associated with moderate post-traumatic stress, which may be associated with a traumatic sexual experience.</p>`,
                                    `<p>Having experiences that are somewhat similar to those associated with post-traumatic stress doesn’t mean you have post-traumatic stress disorder (PTSD).  It does mean that you should look into the concerns you are reporting because they can be upsetting and distressing.  If you’re experiencing significant upset or distress and you are not  in direct contact with support, you should consult your health care provider or a crisis clinic as soon as you can.  If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>You can find specific resources for personal support in AfterDeployment’s “Military Sexual Trauma" and "Post-Traumatic Stress” topics. When someone is experiencing the kinds of distressing symptoms you report, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const SexualTraumaScoring87 = makeScoring(88,44,85,'HIGH',
                                    `<p>Although only a healthcare professional can provide an actual diagnosis,  your score indicates that you are experiencing a significant number of symptoms that are similar to those associated with post-traumatic stress which may be related to a traumatic sexual experience.</p>`,
                                    `<p>The experiences you are describing should be addressed immediately by meeting with a professional with experience in this area, if you are not already doing so. Having experiences that are very similar to those associated with post-traumatic stress suggests that you should look into these concerns because they can be very upsetting and disruptive of your life. If you do not have a professional resource you can access, it’s important to locate someone who can help.</p>               <p> You can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7. You can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab, also in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment. Additional resources that can be accessed immediately can be found on the RESOURCES tab located above.<p/>       <p>We encourage you to check out the materials in AfterDeployment’s “Military Sexual Trauma" and "Post-Traumatic Stress” topics. Also, when someone is experiencing the kinds of distressing concerns you report, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to all of these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const SpiritualityList: ScoringInterface[] = [];


const SpiritualityScoring88 = makeScoring(89,0,1,'LOW',
                                    `<p>Your score is in a range indicating that you are experiencing very little to no spiritual struggle at this time.</p>  <p>Your results suggest that you are comfortable with how your belief system is supporting your ability to manage the stress that comes with the significant challenges and changes in your life.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const SpiritualityScoring89 = makeScoring(90,2,3,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate level of spiritual struggle.</p>  <p>You describe yourself as someone who is experiencing  a moderate degree of spiritual struggle in response to the stress in your life. </p>`,
                                    `<p>Your score suggests that for the most part, you believe you can count on your spiritual beliefs for support during difficult times.  However, you have qualified your confidence in your ability to rely completely on the meaning you find in spirituality.  It is not at all uncommon for trauma, distress, or disappointment to create doubts about some aspects of one’s spiritual beliefs.    If the resulting spiritual struggle is temporary it is likely to have little effect on either your well-being or resilience.  However, even moderate amounts of unresolved, chronic spiritual tension, in the form of anger, resentment or a sense of abandonment, significantly increase the likelihood of physical and emotional problems.   If you would like personal support in examining your spiritual beliefs and disappointments, many spiritual traditions encourage this type of exploration.  In addition to its protective effects on health and well-being, many people find that the process of resolving spiritual struggle leads to personal and spiritual growth.   You can locate a church, synagogue or other spiritual organization near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page.  If you have other personal concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page. Both the CALL and CHAT options are available 24-7.</p> <p>When someone wishes to explore their spiritual understanding, exploring other areas of life can help.  You can do more exploration by taking additional assessments. We also encourage you to check out AfterDeployment's "Spirituality" topic. </p>  <p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const SpiritualityScoring90 = makeScoring(91,4,5,'HIGH',
                                    `<P>Your score is in a range typically associated with a significant degree of spiritual struggle.  You describe yourself as someone who is experiencing significant spiritual conflict in response to stressful experiences. </p>`,
                                    `<p>Your score suggests that you are feeling a high level of tension based on doubts about beliefs  about your spirituality which may have previously helped you to cope with difficulties in life.   This might be because you have experienced significant trauma and have been unable to reconcile that experience with your beliefs.  Many people find themselves questioning long held beliefs in response to trauma, illness, or disappointments.  However,   research suggests that high levels of spiritual struggle, even in the short term, can lead to a great deal of distress, significantly impacting health and well-being.  The longer the tension remains unresolved, the greater the likelihood of serious physical and emotional problems.  Because of the potential impact of your current level of spiritual struggle on your health and well-being, we strongly suggest that you work to resolve the tension you are experiencing.   If you would like personal support in examining your spiritual beliefs and disappointments, many spiritual traditions encourage this type of exploration.    In addition to its protective effects on health and well-being, many people find that the process of resolving spiritual struggle leads to personal and spiritual growth. You can locate a church, synagogue or other spiritual organization near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page.   If you have other personal concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page. Both the CALL and CHAT options are available 24-7.</p> <p>When someone wishes to explore their spiritual understanding, exploring other areas of life can help.  You can do more exploration by taking additional assessments. We also encourage you to check out AfterDeployment's "Spirituality" topic. </p>  <p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


const WorryList: ScoringInterface[] = [];


const WorryScoring91 = makeScoring(92,0,39,'LOW',
                                    `<p>Your score is in a range typically associated with a low level of worry indicating that chronic worry is probably not affecting your life.</p><p>Although only a healthcare professional can provide an actual diagnosis of an anxiety disorder, your results suggest that you are not likely to engage in catastrophic thinking and that you can accurately evaluate the likelihood of negative events occurring in your life.</p>`,
                                    `<p>Your results suggest you are managing this area of your life. Because maintaining healthy habits means a lifestyle that includes stress management and finding balance, we encourage you to check out the many tools in the “Life Stress” topic.</p><p>You may find it helpful to join the <a href="https://www.facebook.com/afterdeployment/timeline">AfterDeployment Facebook</a> page where you can network with others on a range of topics.  </p><p>You're also encouraged to check out other assessments on AfterDeployment to learn if you are having problems in other areas.  You can find links to these tools under the RESOURCES tab located above.</p>`
                                    );



const WorryScoring92 = makeScoring(93,40,59,'MOD',
                                    `<p>Your score is in a range typically associated with a moderate level of worry indicating that worry may be causing you some level of distress.</p><p>Although only a healthcare professional can provide an actual diagnosis, your responses suggest you may be prone to some degree of unrealistic concern about bad things happening in your life.</p>`,
                                    `<p>A moderate degree of worry typically doesn’t cause significant distress or anxiety.  It can take some of the joy out of life however, because worry causes an increase in the level of vigilance and physical arousal, energy that could be better used focusing on positive things in life.  If your worry has increased recently it may be useful to discuss this with your health care provider. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner on the main page.  If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner on the main page. Both the CALL and CHAT options are available 24-7.</p><p>Another way to explore your level of worry is to check out the materials in AfterDeployment’s “Anxiety” topic. When someone is experiencing the kinds of distressing symptoms you report, problems are often present in other areas of life. You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );



const WorryScoring93 = makeScoring(94,60,80,'HIGH',
                                    `<p>Your score is in a range typically associated with a high level of worried thinking and anxiety.</p><p>Although only a healthcare professional can provide an actual diagnosis, worry may be causing you significant distress.</p>`,
                                    `<p>Thinking that regularly predicts catastrophic outcomes can be useful during deployment because those circumstances are legitimately dangerous.  But high levels of anxiety and worry that persists after deployment, when catastrophic outcomes are much less likely, can be harmful to your physical health, and your emotional well-being.  Because you’re reporting significant anxiety and worry, we urge you to seek face-to-face care with a healthcare provider. If you don’t have a provider, you can locate a provider or a clinic near you by clicking on the <a href='http://afterdeployment.dcoe.mil/locate-help'>LOCATE</a> tab in the upper right corner of the main page. We recommend you take a copy of the results of this assessment and share them during your appointment.</p><p>If you have more immediate concerns, you can talk with a professional right now by clicking on the <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=2#qt-quick_tab_header'>CALL</a> or <a href='http://afterdeployment.dcoe.mil/home?qt-quick_tab_header=1#qt-quick_tab_header'>CHAT</a> tabs, also found in the upper right corner of the main page.  Both the CALL and CHAT options are available 24-7.</p><p>We encourage you to check out the materials in AfterDeployment’s “Anxiety” topic. Also, when someone is experiencing the kinds of distressing concerns you report, problems are often present in other areas of life.  You can determine where other problems may exist or the extent of the problem by taking additional assessments. </p><p>You can find links to these tools under the RESOURCES tab located above.</p><p> You may find it helpful to join the <a href='https://www.facebook.com/afterdeployment/timeline'>AfterDeployment Facebook</a> page where you can network with others on a range of topics. </p>`
                                    );


PostTraumaticStressList.push(PostTraumaticStressScoring0);
PostTraumaticStressList.push(PostTraumaticStressScoring1);
PostTraumaticStressList.push(PostTraumaticStressScoring2);
DepressionList.push(DepressionScoring3);
DepressionList.push(DepressionScoring4);
DepressionList.push(DepressionScoring5);
mTBISymptomManagementList.push(mTBISymptomManagementScoring9);
mTBISymptomManagementList.push(mTBISymptomManagementScoring10);
mTBISymptomManagementList.push(mTBISymptomManagementScoring11);
AngerList.push(AngerScoring12);
AngerList.push(AngerScoring13);
AngerList.push(AngerScoring14);
MaritalSatisfactionList.push(MaritalSatisfactionScoring15);
MaritalSatisfactionList.push(MaritalSatisfactionScoring16);
MaritalSatisfactionList.push(MaritalSatisfactionScoring17);
FriendshipScaleList.push(FriendshipScaleScoring18);
FriendshipScaleList.push(FriendshipScaleScoring19);
FriendshipScaleList.push(FriendshipScaleScoring20);
OptimismList.push(OptimismScoring21);
OptimismList.push(OptimismScoring22);
OptimismList.push(OptimismScoring23);
ParentingConfidenceList.push(ParentingConfidenceScoring24);
ParentingConfidenceList.push(ParentingConfidenceScoring25);
ParentingConfidenceList.push(ParentingConfidenceScoring26);
PerceivedSocialSupportList.push(PerceivedSocialSupportScoring27);
PerceivedSocialSupportList.push(PerceivedSocialSupportScoring28);
PerceivedSocialSupportList.push(PerceivedSocialSupportScoring29);
ResilienceList.push(ResilienceScoring30);
ResilienceList.push(ResilienceScoring31);
ResilienceList.push(ResilienceScoring32);
StigmaList.push(StigmaScoring33);
StigmaList.push(StigmaScoring34);
StigmaList.push(StigmaScoring35);
StressList.push(StressScoring36);
StressList.push(StressScoring37);
StressList.push(StressScoring38);
WorkAdjustmentList.push(WorkAdjustmentScoring39);
WorkAdjustmentList.push(WorkAdjustmentScoring40);
WorkAdjustmentList.push(WorkAdjustmentScoring41);
HopeList.push(HopeScoring42);
HopeList.push(HopeScoring43);
HopeList.push(HopeScoring44);
GenerosityList.push(GenerosityScoring45);
GenerosityList.push(GenerosityScoring46);
GenerosityList.push(GenerosityScoring47);
AlcoholDrugsList.push(AlcoholDrugsScoring48);
AlcoholDrugsList.push(AlcoholDrugsScoring49);
AlcoholDrugsList.push(AlcoholDrugsScoring50);
AnxietyList.push(AnxietyScoring55);
AnxietyList.push(AnxietyScoring56);
AnxietyList.push(AnxietyScoring57);
SleepList.push(SleepScoring58);
SleepList.push(SleepScoring59);
SleepList.push(SleepScoring60);
CaregiverStressList.push(CaregiverStressScoring61);
CaregiverStressList.push(CaregiverStressScoring62);
CaregiverStressList.push(CaregiverStressScoring63);
ForgivenessList.push(ForgivenessScoring64);
ForgivenessList.push(ForgivenessScoring65);
ForgivenessList.push(ForgivenessScoring66);
GratitudeList.push(GratitudeScoring67);
GratitudeList.push(GratitudeScoring68);
GratitudeList.push(GratitudeScoring69);
NicotineDependenceList.push(NicotineDependenceScoring70);
NicotineDependenceList.push(NicotineDependenceScoring71);
NicotineDependenceList.push(NicotineDependenceScoring72);
PanicList.push(PanicScoring73);
PanicList.push(PanicScoring74);
PanicList.push(PanicScoring75);
PhysicalInjuryResilienceList.push(PhysicalInjuryResilienceScoring76);
PhysicalInjuryResilienceList.push(PhysicalInjuryResilienceScoring77);
PhysicalInjuryResilienceList.push(PhysicalInjuryResilienceScoring78);
PostDeploymentSocialSupportList.push(PostDeploymentSocialSupportScoring79);
PostDeploymentSocialSupportList.push(PostDeploymentSocialSupportScoring80);
PostDeploymentSocialSupportList.push(PostDeploymentSocialSupportScoring81);
SatisfactionwithLifeList.push(SatisfactionwithLifeScoring82);
SatisfactionwithLifeList.push(SatisfactionwithLifeScoring83);
SatisfactionwithLifeList.push(SatisfactionwithLifeScoring84);
SexualTraumaList.push(SexualTraumaScoring85);
SexualTraumaList.push(SexualTraumaScoring86);
SexualTraumaList.push(SexualTraumaScoring87);
SpiritualityList.push(SpiritualityScoring88);
SpiritualityList.push(SpiritualityScoring89);
SpiritualityList.push(SpiritualityScoring90);
WorryList.push(WorryScoring91);
WorryList.push(WorryScoring92);
WorryList.push(WorryScoring93);



const choicesSet1: ChoicesInterface[] = [
      {title: '0 - Not at all', value: '1', score: 0},
      {title: '1', value: '2', score: 1},
      {title: '2', value: '3', score: 2},
      {title: '3', value: '4', score: 3},
      {title: '4', value: '5', score: 4},
      {title: '5', value: '6', score: 5},
      {title: '6', value: '7', score: 6},
      {title: '7', value: '8', score: 7},
      {title: '8 - Exactly So', value: '9', score: 8}
];



const choicesSet2: ChoicesInterface[] = [
      {title: 'Almost Always', value: '1', score: 4},
      {title: 'Most of the time', value: '2', score: 3},
      {title: 'About half the time', value: '3', score: 2},
      {title: 'Occasionally', value: '4', score: 1},
      {title: 'Not at all', value: '5', score: 0},
];

const choicesSet3: ChoicesInterface[] = [
      {title: 'Almost Always', value: '1', score: 0},
      {title: 'Most of the time', value: '2', score: 1},
      {title: 'About half the time', value: '3', score: 2},
      {title: 'Occasionally', value: '4', score: 3},
      {title: 'Not at all', value: '5', score: 4},
];

const choicesSet4: ChoicesInterface[] = [
      {title: 'Very Unhappy', value: '1', score: 0},
      {title: 'Somewhat Unhappy', value: '2', score: 2},
      {title: 'Slightly Unhappy', value: '3', score: 7},
      {title: 'Happy', value: '4', score: 15},
      {title: 'Pretty Happy', value: '5', score: 20},
      {title: 'Very Happy', value: '6', score: 25},
      {title: 'Perfectly Happy', value: '7', score: 35},
];

const choicesSet5: ChoicesInterface[] = [
      {title: 'Always Agree', value: '1', score: 5},
      {title: 'Almost Always Agree', value: '2', score: 4},
      {title: 'Occasionally Disagree', value: '3', score: 3},
      {title: 'Frequently Disagree', value: '4', score: 2},
      {title: 'Almost Always Disagree', value: '5', score: 1},
      {title: 'Always Disagree', value: '6', score: 0},
];

const choicesSet6: ChoicesInterface[] = [
      {title: 'Always Agree', value: '1', score: 8},
      {title: 'Almost Always Agree', value: '2', score: 6},
      {title: 'Occasionally Disagree', value: '3', score: 4},
      {title: 'Frequently Disagree', value: '4', score: 2},
      {title: 'Almost Always Disagree', value: '5', score: 1},
      {title: 'Always Disagree', value: '6', score: 0},
];

const choicesSet7: ChoicesInterface[] = [
      {title: 'Always Agree', value: '1', score: 15},
      {title: 'Almost Always Agree', value: '2', score: 12},
      {title: 'Occasionally Disagree', value: '3', score: 9},
      {title: 'Frequently Disagree', value: '4', score: 4},
      {title: 'Almost Always Disagree', value: '5', score: 1},
      {title: 'Always Disagree', value: '6', score: 0},
];

const choicesSet8: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 5},
      {title: 'Disagree', value: '2', score: 4},
      {title: 'Neither agree nor disagree', value: '3', score: 3},
      {title: 'Agree', value: '4', score: 2},
      {title: 'Strongly agree', value: '5', score: 1}
];

const choicesSet9: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 1},
      {title: 'Disagree', value: '2', score: 2},
      {title: 'Neither agree nor disagree', value: '3', score: 3},
      {title: 'Agree', value: '4', score: 4},
      {title: 'Strongly agree', value: '5', score: 5}
];

const choicesSet10: ChoicesInterface[] = [
      {title: 'Mother', value: '1', score: 0},
      {title: 'Father', value: '2', score: 0},
      {title: 'Other', value: '3', score: 0}
];

const choicesSet11: ChoicesInterface[] = [
      {title: 'Strongly Agree', value: '1', score: 1},
      {title: 'Agree', value: '2', score: 2},
      {title: 'Mildly Agree', value: '3', score: 3},
      {title: 'Mildly Disagree', value: '4', score: 4},
      {title: 'Disagree', value: '5', score: 5},
      {title: 'Strongly Disagree', value: '6', score: 6}
];

const choicesSet12: ChoicesInterface[] = [
      {title: 'Strongly Agree', value: '1', score: 6},
      {title: 'Agree', value: '2', score: 5},
      {title: 'Mildly Agree', value: '3', score: 4},
      {title: 'Mildly Disagree', value: '4', score: 3},
      {title: 'Disagree', value: '5', score: 2},
      {title: 'Strongly Disagree', value: '6', score: 1}
];

const choicesSet13: ChoicesInterface[] = [
      {title: 'husband giving in', value: '1', score: 0},
      {title: 'wife giving in', value: '2', score: 2},
      {title: 'agreement by mutual give and take', value: '3', score: 10},
];
const choicesSet14: ChoicesInterface[] = [
      {title: 'All of them', value: '1', score: 10},
      {title: 'Some of them', value: '2', score: 8},
      {title: 'Very few of them', value: '3', score: 3},
      {title: 'None of them', value: '4', score: 0}
];

const choicesSet15: ChoicesInterface[] = [
      {title: 'to both be "On the go" ', value: '1', score: 3},
      {title: 'to both be stay at home ', value: '2', score: 10},
      {title: 'neither', value: '3', score: 2}
];

const choicesSet16: ChoicesInterface[] = [
      {title: 'Frequently', value: '1', score: 0},
      {title: 'Occasionally', value: '2', score: 3},
      {title: 'Rarely', value: '3', score: 8},
      {title: 'Never', value: '4', score: 15}
];

const choicesSet17: ChoicesInterface[] = [
      {title: 'Marry the same person', value: '1', score: 15},
      {title: 'Marry a different person', value: '2', score: 0},
      {title: 'Not marry at all', value: '3', score: 1}
];

const choicesSet18: ChoicesInterface[] = [
      {title: 'almost never', value: '1', score: 0},
      {title: 'rarely', value: '2', score: 2},
      {title: 'in most things', value: '3', score: 10},
      {title: 'in everything', value: '4', score: 10}
];

const choicesSet19: ChoicesInterface[] = [
      {title: 'Very Strongly Disagree', value: '1', score: 1},
      {title: 'Strongly Disagree', value: '2', score: 2},
      {title: 'Mildly Disagree', value: '3', score: 3},
      {title: 'Neutral', value: '4', score: 4},
      {title: 'Mildly Agree', value: '5', score: 5},
      {title: 'Strongly Agree', value: '6', score: 6},
      {title: 'Very Strongly Agree', value: '7', score: 7}
];

const choicesSet20: ChoicesInterface[] = [
      {title: 'Never', value: '1', score: 0},
      {title: 'Once or Twice', value: '2', score: 2},
      {title: 'Monthly', value: '3', score: 3},
      {title: 'Weekly', value: '4', score: 4},
      {title: 'Daily or almost daily', value: '5', score: 6},
];

const choicesSet21: ChoicesInterface[] = [
      {title: 'Never', value: '1', score: 0},
      {title: 'Once or Twice', value: '2', score: 3},
      {title: 'Monthly', value: '3', score: 4},
      {title: 'Weekly', value: '4', score: 5},
      {title: 'Daily or almost daily', value: '5', score: 6},
];

const choicesSet22: ChoicesInterface[] = [
      {title: 'Never', value: '1', score: 0},
      {title: 'Once or Twice', value: '2', score: 5},
      {title: 'Monthly', value: '3', score: 6},
      {title: 'Weekly', value: '4', score: 7},
      {title: 'Daily or almost daily', value: '5', score: 8},
];

const choicesSet23: ChoicesInterface[] = [
      {title: 'No, Never', value: '1', score: 0},
      {title: 'Yes, in the past 3 months', value: '2', score: 6},
      {title: 'Yes, but not in the past 3 months', value: '3', score: 3}
];

const choicesSet24: ChoicesInterface[] = [
  {title: 'Not at all', value: '1', score: 1},
  {title: 'A little bit', value: '2', score: 2},
  {title: 'Moderately', value: '3', score: 3},
  {title: 'Quite a bit', value: '4', score: 4},
  {title: 'Extremely', value: '5', score: 5},   
];

const choicesSet25: ChoicesInterface[] = [
  {title: 'Not at all', value: '1', score: 0},
  {title: 'Several days', value: '2', score: 1},
  {title: 'More than half the days', value: '3', score: 2},
  {title: 'Nearly Every day', value: '4', score: 3}    
];

const choicesSet26: ChoicesInterface[] = [
  {title: 'Not at all', value: '1', score: 0},
  {title: 'Several days', value: '2', score: 0},
  {title: 'More than half the days', value: '3', score: 0},
  {title: 'Nearly Every day', value: '4', score: 0}    
];

const choicesSet27: ChoicesInterface[] = [
  {title: 'Exactly Like Me', value: '1', score: 4},
  {title: 'A Lot Like Me', value: '2', score: 3},
  {title: 'Somewhat Like Me', value: '3', score: 2},
  {title: 'A tiny bit Like M', value: '4', score: 1},
  {title: 'Not at All Like Me', value: '4', score: 0}    
];

const choicesSet28: ChoicesInterface[] = [
      {title: 'True', value: '1', score: 1},
      {title: 'False', value: '2', score: 0}
];
const choicesSet29: ChoicesInterface[] = [
      {title: 'No', value: '1', score: 0},
      {title: 'Yes', value: '2', score: 1}
];
;

const choicesSet30: ChoicesInterface[] = [
      {title: 'Never', value: '1', score: 0},
      {title: 'Almost Never', value: '2', score: 1},
      {title: 'Sometimes', value: '3', score: 2},
      {title: 'Fairly often ', value: '4', score: 3},
      {title: 'Very often ', value: '5', score: 4}
];
const choicesSet31: ChoicesInterface[] = [
      {title: 'Never', value: '1', score: 4},
      {title: 'Almost Never', value: '2', score: 3},
      {title: 'Sometimes', value: '3', score: 2},
      {title: 'Fairly often ', value: '4', score: 1},
      {title: 'Very often ', value: '5', score: 0}
];

const choicesSet32: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 1},
      {title: 'Disagree', value: '2', score: 2},
      {title: 'Agree and Disagree Equally', value: '3', score: 3},
      {title: 'Agree', value: '4', score: 4},
      {title: 'Strongly agree', value: '5', score: 5}
];

const choicesSet33: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 5},
      {title: 'Disagree', value: '2', score: 4},
      {title: 'Agree and Disagree Equally', value: '3', score: 3},
      {title: 'Agree', value: '4', score: 2},
      {title: 'Strongly agree', value: '5', score: 1}
];

const choicesSet34: ChoicesInterface[] = [
  {title: '1 - Not at all typical of me', value: '1', score: 1},
  {title: '2', value: '2', score: 2},
  {title: '3', value: '3', score: 3},
  {title: '4', value: '4', score: 4},
  {title: '5 - Very typical of me', value: '5', score: 5}
];
const choicesSet35: ChoicesInterface[] = [
  {title: '1 - Not at all typical of me', value: '1', score: 5},
  {title: '2', value: '2', score: 4},
  {title: '3', value: '3', score: 3},
  {title: '4', value: '4', score: 2},
  {title: '5 - Very typical of me', value: '5', score: 1}
];

const choicesSet36: ChoicesInterface[] = [
      {title: '1 - Almost always false of me.', value: '1', score: 1},
      {title: '2', value: '2', score: 2},
      {title: '3 - More often false of me', value: '3', score: 3},
      {title: '4', value: '4', score: 4},
      {title: '5 - More often true of me', value: '5', score: 5},
      {title: '6', value: '6', score: 6},
      {title: '7 - Almost always true of me', value: '7', score: 7}
];

const choicesSet37: ChoicesInterface[] = [
      {title: '1 - Almost always false of me.', value: '1', score: 7},
      {title: '2', value: '2', score: 6},
      {title: '3 - More often false of me', value: '3', score: 5},
      {title: '4', value: '4', score: 4},
      {title: '5 - More often true of me', value: '5', score: 3},
      {title: '6', value: '6', score: 2},
      {title: '7 - Almost always true of me', value: '7', score: 1}
];

const choicesSet38: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 1},
      {title: 'Disagree', value: '2', score: 2},
      {title: 'Slightly disagree', value: '3', score: 3},
      {title: 'Neutral', value: '4', score: 4},
      {title: 'Slightly agree', value: '5', score: 5},
      {title: 'Agree', value: '6', score: 6},
      {title: 'Strongly Agree', value: '7', score: 7}
];

const choicesSet39: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 7},
      {title: 'Disagree', value: '2', score: 6},
      {title: 'Slightly disagree', value: '3', score: 5},
      {title: 'Neutral', value: '4', score: 4},
      {title: 'Slightly agree', value: '5', score: 3},
      {title: 'Agree', value: '6', score: 2},
      {title: 'Strongly Agree', value: '7', score: 1}
];

const choicesSet40: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 0},
      {title: 'Disagree', value: '2', score: 1},
      {title: 'Neutral', value: '3', score: 2},
      {title: 'Agree', value: '4', score: 3},
      {title: 'Strongly Agree', value: '5', score: 4},
];

const choicesSet41: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 4},
      {title: 'Disagree', value: '2', score: 3},
      {title: 'Neutral', value: '3', score: 2},
      {title: 'Agree', value: '4', score: 1},
      {title: 'Strongly Agree', value: '5', score: 0},
];

const choicesSet42: ChoicesInterface[] = [
      {title: 'Strongly disagree', value: '1', score: 0},
      {title: 'Disagree', value: '2', score: 0},
      {title: 'Neutral', value: '3', score: 0},
      {title: 'Agree', value: '4', score: 0},
      {title: 'Strongly Agree', value: '5', score: 0}
];

const worryAssessmentQs: QuestionInterface[] = [
  makeQuestion('1','If I do not have enough time to do everything, I do not worry about it.','select',choicesSet35),
  makeQuestion('2','My worries overwhelm me.','select',choicesSet34),
  makeQuestion('3','I do not tend to worry about things.','select',choicesSet35),
  makeQuestion('4','Many situations make me worry.','select',choicesSet34),
  makeQuestion('5','I know I should not worry about things, but I just cannot help it.','select',choicesSet34),
  makeQuestion('6','When I am under pressure I worry a lot.','select',choicesSet34),
  makeQuestion('7','I am always worrying about something.','select',choicesSet34),
  makeQuestion('8','I find it easy to dismiss worrisome thoughts.','select',choicesSet35),
  makeQuestion('9','As soon as I finish one task, I start to worry about everything else I have to do.','select',choicesSet34),
  makeQuestion('10','I never worry about anything.','select',choicesSet35),
  makeQuestion('11','When there is nothing more I can do about a concern, I do not worry about it anymore.','select',choicesSet35),
  makeQuestion('12','I have been a worrier all my life.','select',choicesSet34),
  makeQuestion('13','I notice that I have been worrying about things.','select',choicesSet34),
  makeQuestion('14','Once I start worrying, I cannot stop.','select',choicesSet34),
  makeQuestion('15','I worry all the time.','select',choicesSet34),
  makeQuestion('16','I worry about projects until they are all done.','select',choicesSet34),
]

const friendShipQuestions: QuestionInterface[] = [
  makeQuestion(1,'It has been easy to relate to others.','select',choicesSet2),
  makeQuestion(2,'I felt isolated from other people.','select',choicesSet3),
  makeQuestion(3,'I had someone to share my feelings with.','select',choicesSet2),
  makeQuestion(4,'I found it easy to get in touch with others when I needed to.','select',choicesSet2),
  makeQuestion(5,'When with other people, I felt separate from them.','select',choicesSet3),
  makeQuestion(6,'I felt alone and friendless.','select',choicesSet3)
];

const marraigeHappinessQuestion = makeQuestion(
      1, 
      'Which describes the degree of happiness of your present marriage?',
      'select',
      choicesSet4
      );

const maritalSatisfactionQuestions: QuestionInterface[] = [
  marraigeHappinessQuestion,
  makeQuestion(2,'Handling Family Finances','select',choicesSet5),
  makeQuestion(3,'Matters of Recreation','select',choicesSet5),
  makeQuestion(4,'Demonstration of Affection','select',choicesSet6),
  makeQuestion(5,'Friends','select',choicesSet5),
  makeQuestion(6,'Sex Relations','select',choicesSet7),
  makeQuestion(7,'Conventionality (right, good, or proper conduct)','select',choicesSet5),
  makeQuestion(8,'Philosophy of Life','select',choicesSet5),
  makeQuestion(9,'Ways of dealing with in-laws','select',choicesSet5),
  makeQuestion(10,'When disagreements arise, they usually result in:','select', choicesSet13),
  makeQuestion(11,'Do you and your mate engage in outside interests together?','select', choicesSet14),
  makeQuestion(12,'In leisure time do you generally prefer:','select',choicesSet15),
  makeQuestion(13,'Do you ever wish you had not married?','select',choicesSet16),
  makeQuestion(14,'If you had your life to live over again, do you think you would:','select',choicesSet17),
  makeQuestion(15,'Do you ever confide in your mate:','select',choicesSet18)
];

const percSocialSupportQuestions: QuestionInterface[] = [
  makeQuestion(1,'There is a special person who is around when I am in need.','select',choicesSet19),
  makeQuestion(2,'There is a special person with whom I can share my joys and sorrows.','select',choicesSet19),
  makeQuestion(3,'My family really tries to help me.','select',choicesSet19),
  makeQuestion(4,'I get the emotional help and support I need from my family.','select',choicesSet19),
  makeQuestion(5,'I have a special person who is a real source of comfort to me.','select',choicesSet19),
  makeQuestion(6,'My friends really try to help me.','select',choicesSet19),

  makeQuestion(7,'I can count on my friends when things go wrong.','select',choicesSet19),
  makeQuestion(8,'I can talk about my problems with my family.','select',choicesSet19),
  makeQuestion(9,'I have friends with whom I can share my joys and sorrows.','select',choicesSet19),

  makeQuestion(10,'There is a special person in my life who cares about my feelings.','select',choicesSet19),
  makeQuestion(11,'My family is willing to help me make decisions.','select',choicesSet19),
  makeQuestion(12,'I can talk about my problems with my friends.','select',choicesSet19)
];

const postDepSupportQuestions: QuestionInterface[] = [
  makeQuestion(1,'The reception I received when I returned from my deployment made me feel appreciated for my efforts.','select',choicesSet9),
  makeQuestion(2,'The American people made me feel at home when I returned.','select',choicesSet9),
  makeQuestion(3,'When I returned, people made me feel proud to have served my country in the armed forces.','select',choicesSet9),

  makeQuestion(4,'I am carefully listened to and understood by family members or friends.','select',choicesSet9),
  makeQuestion(5,'Among my family or relatives, there is someone who makes me feel better when I am feeling down.','select',choicesSet9),
  makeQuestion(6,'I have problems that I can’t discuss with family or friends.','select',choicesSet8),

  makeQuestion(7,'Among my friends or relatives, there is someone I go to when I need good advice.','select',choicesSet9),
  makeQuestion(8,'People at home just don’t understand what I have been through in the armed forces.','select',choicesSet8),
  makeQuestion(9,'There are people to whom I can talk about my deployment experiences.','select',choicesSet9),

  makeQuestion(10,'The people I work with respect the fact that I am a veteran or service member.','select',choicesSet9),
  makeQuestion(11,'My supervisor understands when I need time to take off to take care of personal matters.','select',choicesSet9),
  makeQuestion(12,'My friends or relatives would lend me money if I needed it.','select',choicesSet9),

  makeQuestion(13,'My friends or relatives would help me move my belongings if I needed to.','select',choicesSet9),
  makeQuestion(14,'When I am unable to attend to daily chores, there is someone who will help me with these tasks.','select',choicesSet9),
  makeQuestion(15,'When I am ill, friends or family members will help out until I am well.','select',choicesSet9)
];

const parentingConfidenceAssessment: QuestionInterface[] = [
  makeQuestion(1,'Are you a Mother/Father/Other?','select',choicesSet10),
  makeQuestion(2,'The problems of taking care of a child are easy to solve once you know how your actions affect your child, an understanding I have acquired.','select',choicesSet12),
  makeQuestion(3,'Even though being a parent could be rewarding, I am frustrated now while my child is at his/her present age.','select',choicesSet11),
  makeQuestion(4,'I go to bed the same way I wake up in the morning—feeling I have not accomplished a whole lot.','select',choicesSet11),
  makeQuestion(5,'I do not know what it is, but sometimes when I’m supposed to be in control, I feel more like the one being manipulated.','select',choicesSet11),
  makeQuestion(6,'My parent was better prepared to be a good parent than I am.','select',choicesSet11),
  makeQuestion(7,'I would make a fine model for a new parent to follow in order to learn what she/he would need to know in order to be a good parent.','select',choicesSet12),
  makeQuestion(8,'Being a parent is manageable, and any problems are easily solved.','select',choicesSet12),
  makeQuestion(9,'A difficult problem in being a parent is not knowing whether you’re doing a good job or a bad one.','select',choicesSet11),
  makeQuestion(10,'Sometimes I feel like I’m not getting anything done.','select',choicesSet11),
  makeQuestion(11,'I meet my own personal expectations for expertise in caring for my child.','select',choicesSet12),
  makeQuestion(12,'If anyone can find the answer to what is troubling my child, I am the one.','select',choicesSet12),
  makeQuestion(13,'My talents and interests are in other areas, not in being a parent.','select',choicesSet11),
  makeQuestion(14,' Considering how long I’ve been a parent, I feel thoroughly familiar with this role.','select',choicesSet12),
  makeQuestion(15,'If being a parent of a child were only more interesting, I would be motivated to do a better job as a parent.','select',choicesSet11),
  makeQuestion(16,' I honestly believe I have all the skills necessary to be a good parent to my child.','select',choicesSet12),
  makeQuestion(17,'Being a parent makes me tense and anxious.','select',choicesSet11),
]

const angerQuestions: QuestionInterface[] = [
  makeQuestion(1,'I often find myself getting angry at people or situations.','select',choicesSet1),
  makeQuestion(2,'When I get angry, I get really mad.','select',choicesSet1),
  makeQuestion(3,'When I get angry, I stay angry.','select',choicesSet1),
  makeQuestion(4,'When I get angry at someone, I want to hit or clobber the person.','select',choicesSet1),
  makeQuestion(5,'My anger interferes with my ability to get my work done.','select',choicesSet1),
  makeQuestion(6,'My anger prevents me from getting along with people as well as I would like to.','select',choicesSet1),
  makeQuestion(7,'My anger has a bad effect on my health.','select',choicesSet1),
];

const stressQuestions: QuestionInterface[] = [
  makeQuestion(1,'In the last month, how often have you been upset because of something that happened unexpectedly?','select',choicesSet30),
  makeQuestion(2,'In the last month, how often have you felt that you were unable to control the important things in your life?','select',choicesSet30),
  makeQuestion(3,'In the last month, how often have you felt nervous and stressed?','select',choicesSet30),
  makeQuestion(4,'In the last month, how often have you felt confident about your ability to handle your personal problems?','select',choicesSet31),
  makeQuestion(5,'In the last month, how often have you felt that things were going your way?','select',choicesSet31),
  makeQuestion(6,'In the last month, how often have you found that you could not cope with all the things that you had to do?','select',choicesSet30),
  makeQuestion(7,'In the last month, how often have you been able to control irritations in your life?','select',choicesSet31),
  makeQuestion(8,'In the last month, how often have you felt that you were on top of things?','select',choicesSet31),
  makeQuestion(9,'In the last month, how often have you been angered because of things that were outside of your control?','select',choicesSet30),
  makeQuestion(10,'In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?','select',choicesSet30),
];


const stigmaQuestions: QuestionInterface[] = [
  makeQuestion(1,'I would feel inadequate if I went to a therapist for psychological help.','select',choicesSet32),
  makeQuestion(2,'My self-confidence would NOT be threatened if I sought professional help.','select',choicesSet33),
  makeQuestion(3,'Seeking psychological help would make me feel less intelligent.','select',choicesSet32),
  makeQuestion(4,'My self-esteem would increase if I talked to a therapist.','select',choicesSet33),
  makeQuestion(5,'My view of myself would not change just because I made the choice to see a therapist.','select',choicesSet33),
  makeQuestion(6,'It would make me feel inferior to ask a therapist for help.','select',choicesSet32),
  makeQuestion(7,'I would feel okay about myself if I made the choice to seek professional help.','select',choicesSet33),
  makeQuestion(8,'If I went to a therapist, I would be less satisfied with myself.','select',choicesSet32),
  makeQuestion(9,'My self-confidence would remain the same if I sought professional help for a problem I could not solve.','select',choicesSet33),
  makeQuestion(10,'I would feel worse about myself if I could not solve my own problems.','select',choicesSet32),
];


const forgivenessQuestions: QuestionInterface[] = [
  makeQuestion(1,'Although I feel bad at first when I mess up, over time I can give myself some slack','select',choicesSet36),
  makeQuestion(2,'I hold grudges against myself for negative things I\'ve done.','select',choicesSet37),
  makeQuestion(3,'Learning from bad things that I\'ve done helps me get over them.','select',choicesSet36),
  makeQuestion(4,'It is really hard for me to accept myself once I\'ve messed up.','select',choicesSet37),
  makeQuestion(5,'With time I am understanding of myself for mistakes I\'ve made.','select',choicesSet36),
  makeQuestion(6,'I  don’t stop criticizing myself for negative things I\'ve felt, thought, said, or done.','select',choicesSet37),
  makeQuestion(7,'I continue to punish a person who has done something that I think is wrong.','select',choicesSet37),
  makeQuestion(8,'With time I am understanding of others for the mistakes they\'ve mad','select',choicesSet36),
  makeQuestion(9,'I continue to be hard on others who have hurt me.','select',choicesSet37),
  makeQuestion(10,'Although others have hurt me in the past, I have eventually been able to see them as good people.','select',choicesSet36),
  makeQuestion(11,'If others mistreat me, I continue to think badly of them.','select',choicesSet37),
  makeQuestion(12,'When someone disappoints me, I can eventually move past it.','select',choicesSet36),
  makeQuestion(13,'When things go wrong for reasons that can\'t be controlled, I get stuck in negative thoughts about it.','select',choicesSet37),
  makeQuestion(14,'With time I can be understanding of bad circumstances in my life.','select',choicesSet36),
  makeQuestion(15,'If I am disappointed by uncontrollable circumstances in my life, I continue to think negatively about them.','select',choicesSet37),
  makeQuestion(16,'I eventually make peace with bad situations in my life.','select',choicesSet36),
  makeQuestion(17,'It\'s really hard for me to accept negative situations that aren\'t anybody’s faut','select',choicesSet37),
  makeQuestion(18,'Eventually I let go of negative thoughts about bad circumstances that are beyond anyone\'s control.','select',choicesSet37),
];

//choicesSet38
const gratitudeAssessmentQs: QuestionInterface[] = [
  makeQuestion(1,'I have so much in life to be thankful for.','select',choicesSet38),
  makeQuestion(2,'If I had to list everything that I felt grateful for, it would be a very long list.','select',choicesSet38),
  makeQuestion(3,'When I look at the world, I don\'t see much to be grateful for','select',choicesSet39),
  makeQuestion(4,'I am grateful for a wide variety of people.','select',choicesSet38),
  makeQuestion(5,'As I get older, I find myself more able to appreciate the people, events, and situations that have been part of my life history.','select',choicesSet38),
  makeQuestion(6,'Long amounts of time can go by before I feel grateful to something or someone.','select',choicesSet39),
];

const alcImage = 'res/images/Alcohol_and_Drugs.jpg';
const ptsImage = 'res/images/Post_Traumatic_Stress.jpg';
const depressImage = 'res/images/Depression.jpg';
const anxietyImage = 'res/images/Anxiety.jpg';
const panicImage = 'res/images/Panic.jpg';
const physInjuryImage = 'res/images/PhysicaI_Injury_Resilience.jpg';
const sleepImage = 'res/images/Sleep.jpg';

const friendsImage = 'res/images/Friendship_Scale.jpg';
const marriageImage  = 'res/images/Marital_Satisfaction.jpg';
const socialImage  = 'res/images/Perceived_Social_Support.jpg';
const postDepSocialImage = 'res/images/Post_Deployment_Social_Support.jpg';
const parentingConfidenceImage = 'res/images/Parenting_Confidence.jpg';
const angerImage = panicImage;
const stressImage = postDepSocialImage;
const stigmaImage = ptsImage;

/////////////////////////////////////PORT of Drugs Assessments START
const getQuestionScore = (value,choices) => {
  return choices.reduce((score,choice) => {
                            if(choice.value === value){
                              score += choice.score;
                            }
                            return score;
                          },0);
}
const makeIdHashMap = (items: {id:string}[]) => {
  return items.reduce((map,q) => {
                          map[q.id] = q;
                          return map;
                        },{})
}

const getSubstanceScore = (substanceQuestions,values,questionsMap) => {
  return substanceQuestions.reduce((tally, qId) => {
    const value = typeof values[qId] !== 'undefined' ? values[qId] : null;
    if(value && typeof questionsMap[qId] !== 'undefined'){
      const choices = questionsMap[qId].choices;
      tally += getQuestionScore(value,choices);
    }
    return tally;
  },0);
}
const returnInRange = (numbers: number[], min: number, max: number) => {
  return numbers.filter((number) => {
    return number >= min && number <= max;
  });
}
const calcDrugsScore = function(values: any){
  var allSubstances = ['2','3','4','5','6'];
  const alcQuestions = ['2','7_2','8_2','9_2','10_2']; 
  const potQuestions = ['3','7_3','8_3','9_3','10_3']; 
  const cokeQuestions = ['4','7_4','8_4','9_4','10_4']; 
  const amphQuestions = ['5','7_5','8_5','9_5','10_5']; 
  const sedQuestions = ['6','7_6','8_6','9_6','10_6'];
  const substancesUsed = ['2','3','4','5','6'];
  
  const questionsMap = makeIdHashMap(this.calcQuestions(values));

  var chosenSubstances = []; //question1 chosen substances
  let alcChosen = false;

  allSubstances.map(qId => {
     if(typeof values[qId] !== 'undefined' && values[qId] === '2'){
       chosenSubstances.push(qId);
       if(qId === '2'){
         alcChosen = true;
       }
     }
  });
  const noneChosen = chosenSubstances.length === 0;
  const onlyAlc = chosenSubstances.length === 1 && alcChosen;
  
  let alcScore  = getSubstanceScore(alcQuestions,values,questionsMap);
  let potScore = getSubstanceScore(potQuestions,values,questionsMap);
  let cokeScore = getSubstanceScore(cokeQuestions,values,questionsMap);
  let amphScore = getSubstanceScore(amphQuestions,values,questionsMap);
  let sedScore = getSubstanceScore(sedQuestions,values,questionsMap);
  let scoresArray = [alcScore,potScore,cokeScore,amphScore,sedScore];
  let areAllDrugsLowUsagec = noneChosen;
  if(!areAllDrugsLowUsagec){
     areAllDrugsLowUsagec = alcScore < 4 && potScore < 4 && cokeScore < 4 && amphScore < 4 && sedScore < 4;
  }
 //0 - 14 = low, 15-29= mod, 30 - 40 = high
  const isAnyDrugModerate = returnInRange(scoresArray,4,26).length > 0;
  const isAnyDrugHigh = returnInRange(scoresArray,27,38).length > 0;
  const isLowAlc = (alcScore >= 0 && alcScore < 11);
  const isModAlc = (alcScore >= 11 && alcScore < 27);
  const isHighAlc = (alcScore >= 27 && alcScore < 39);
  if(noneChosen){
     return 0;
  }

  if(!noneChosen && areAllDrugsLowUsagec && !onlyAlc && isLowAlc){
    //Low Alcohol and Drug Acuity
    return 4
  }

  if(!noneChosen && areAllDrugsLowUsagec && !onlyAlc && isModAlc){
    //Moderate Alcohol Acuity
    return 20;
  }

  if(!noneChosen && areAllDrugsLowUsagec && !onlyAlc && isHighAlc){
    //High Alcohol Acuity
    return 30;
  }

  if(isAnyDrugModerate && !isAnyDrugHigh && isLowAlc){
    //Moderate Drug Acuity
    return 25;
  }

  if(isAnyDrugHigh && isLowAlc){
    //High Drug Acuity
    return 35;
  }

  if(isModAlc && isAnyDrugModerate && !isAnyDrugHigh){
    //Moderate Alcohol and Drug Acuity
    return 20;
  }

  if((isHighAlc && (isAnyDrugModerate || isAnyDrugHigh)) || (isAnyDrugHigh && (isModAlc || isHighAlc))){
    //High Alcohol and Drug Acuity
    return 35
  }

  return scoresArray.reduce((tally,score)=>{
    tally + score;
    return tally;
  },0);
}

const calcAlcDrugQuestions = function(values: any){
      var allSubstances = ['1','2','3','4','5','6']; //Logicly these 6 questions "are" question one
      var question2Dependents = ['8','9','10'];
      var chosen = []; //question1 chosen substances
      allSubstances.map(qId => {
         if(typeof values[qId] !== 'undefined' && values[qId] === '2'){
           chosen.push(qId);
         }
      })

      const questionsMap = this.questions.reduce((acc,item) => {
          acc[item.id] = item;
          return acc;
      },{});

      let substanceQuestions = this.questions.filter(q => {
         if(parseInt(q.id) <= 6){
           return true;
         }
         return false;
      });
      
      
      let conditionalQuestions2Labels = this.questions.filter(q => {
         if(chosen.length > 0 && parseInt(q.id) === 7){
           return true;
         }
         return false;
      });

      let conditionalQuestions3Labels = this.questions.filter(q => {
         if(chosen.length > 0 && parseInt(q.id) > 7 && parseInt(q.id) < 11){
           return true;
         }
         return false;
      });
      
      let conditionalQuestions2 = [];
      let condition2chosenSubstances = [];
      if(chosen.length > 0){
        conditionalQuestions2Labels.map((ql) => {
          conditionalQuestions2.push(ql);
          chosen.map((qcId) => {
            var subQuestion = questionsMap[qcId];
            if(subQuestion){
              let questionId = ql.id + '_' + qcId;
              conditionalQuestions2.push(
                makeQuestion(questionId, subQuestion.title, 'select', ql.choices)
              )

              if(typeof values[questionId] !== 'undefined' && values[questionId] !== '1'){
                condition2chosenSubstances.push(subQuestion); 
              }
            }
          });
        })
      }
      let conditionalQuestions3 = [];
      if(condition2chosenSubstances.length > 0){
        conditionalQuestions3Labels.map((ql) => {
          conditionalQuestions3.push(ql);
          condition2chosenSubstances.map((subQuestion) => {
              let questionId = ql.id + '_' + subQuestion.id;
              conditionalQuestions3.push(
                makeQuestion(questionId, subQuestion.title, 'select', ql.choices)
              )
          });
        })
      }

      return substanceQuestions.concat(conditionalQuestions2).concat(conditionalQuestions3);
}

const calcPanicQuestions = function(values: any = {}){
   const firstQuestionId = '1';
   let firstQuestionYes = false;
   if(typeof values[firstQuestionId] !== 'undefined' && values[firstQuestionId] === '2'){
     firstQuestionYes = true;
   }
   if(!firstQuestionYes){
     return [this.questions[0]]
   }
   return this.questions;
}
const calcPanicScore = function(values: any = {}){
   const firstQuestionId = '1';
   const firstFour = ['2','3','4','5'];
   const remainingQuestions = ['6','7','8','9','10','11','12','13','14','15'];
   let firstQuestionYes = false;
   if(typeof values[firstQuestionId] !== 'undefined' && values[firstQuestionId] === '2'){
     firstQuestionYes = true;
   }

   const first4Yes = firstFour.filter((qId) => {
       if(typeof values[qId] !== 'undefined' && values[qId] === '2'){
         return true;
       }
       return false;
   });

   const remainingYes = remainingQuestions.filter((qId) => {
       if(typeof values[qId] !== 'undefined' && values[qId] === '2'){
         return true;
       }
       return false;
   });


   const arefirst4PanicYes = first4Yes.length === 4;
   const anyRemainingYes = remainingYes.length > 0;
   const atleast4RemainingYes = remainingYes.length > 3;

   if(!firstQuestionYes){
     return 5;
   }
   if(arefirst4PanicYes && atleast4RemainingYes ){
     return 55;
   }

   if(arefirst4PanicYes && anyRemainingYes){
     return 35;
   }

   return 15;
}
const alcDrugsQuestions: QuestionInterface[] = [
  makeQuestion('1','In your lifetime, which of the following substances have you ever used? (NON-MEDICAL USE ONLY)','label'),
  makeQuestion('2','Alcohol (beer, wine, spirits, etc.)','select',choicesSet29),
  makeQuestion('3','Cannabis (marijuana, pot, grass, hash, etc.)','select',choicesSet29),
  makeQuestion('4','Cocaine (coke, crack, etc.)','select',choicesSet29),
  makeQuestion('5','Amphetamine type stimulants (speed, diet pills, ecstasy, etc.)','select',choicesSet29),
  makeQuestion('6','Sedatives or sleeping pills (Valium, Serapax, Rohypnol, Ambien, etc.)','select',choicesSet29),

  makeQuestion('7','In the past three months, how often have you used each of the following substances? (NON-MEDICAL USE ONLY)','label',choicesSet20),
  makeQuestion('8','During the past three months, how often have you had a strong desire or urge to use [substance]?','label', choicesSet21),
  makeQuestion('9','During the past three months, how often has your use of [substance] led to health, social, legal, or financial problems?','label', choicesSet20),
  makeQuestion('10','During the past three months, how often have you failed to do what was normally expected of you because of your use of [substance]?','label', choicesSet22),
  makeQuestion('11','Has a friend or anyone else ever expressed concern because of your use of [substance]?','label', choicesSet23),
  makeQuestion('12','Have your ever tried and failed to control, cut down or stop using [substance]?','label', choicesSet23),
];

const ptsQuestions: QuestionInterface[] = [
  makeQuestion('1','Repeated, disturbing memories, thoughts, or images of a stressful military experience from the past?','select',choicesSet24),
  makeQuestion('2','Repeated, disturbing dreams of a stressful military experience from the past?','select',choicesSet24),
  makeQuestion('3','Suddenly acting or feeling as if a stressful military experience were happening again (as if you were reliving it)? ','select',choicesSet24),
  makeQuestion('4','Feeling very upset when something reminded you of a stressful military experience from the past?','select',choicesSet24),
  makeQuestion('5','Having physical reactions (e.g., heart pounding, trouble breathing, or sweating) when something reminded you of a stressful military experience from the past? ','select',choicesSet24),
  makeQuestion('6','Avoiding thinking about or talking about a stressful military experience from the past or avoid having feelings related to it?','select',choicesSet24),
  makeQuestion('7','Avoid activities or situations because they remind you of a stressful military experience from the past? ','select',choicesSet24),
  makeQuestion('8','Trouble remembering important parts of a stressful military experience from the past?','select',choicesSet24),
  makeQuestion('9','Loss of interest in things that you used to enjoy?','select',choicesSet24),
  makeQuestion('10','Feeling distant or cut off from other people? ','select',choicesSet24),
  makeQuestion('11','Feeling emotionally numb or being unable to have loving feelings for those close to you?','select',choicesSet24),
  makeQuestion('12','Feeling as if your future will somehow be cut short? ','select',choicesSet24),
  makeQuestion('13','Trouble falling or staying asleep? ','select',choicesSet24),
  makeQuestion('14','Feeling irritable or having angry outbursts?','select',choicesSet24),
  makeQuestion('15','Having difficulty concentrating?','select',choicesSet24),
  makeQuestion('16','Being "super alert" or watchful on guard?','select',choicesSet24),
  makeQuestion('17','Feeling jumpy or easily startled?','select',choicesSet24),
];
const depressionQuestions: QuestionInterface[] = [
  makeQuestion('1','How often have you been bothered by having little interest or pleasure in doing things?','select',choicesSet25),
  makeQuestion('2','How often have you been bothered by feeling down, depressed or hopeless?','select',choicesSet25),
  makeQuestion('3','Over the last two weeks, how often have you been bothered by any of the following problems? ','label'),
  makeQuestion('4','Trouble falling or staying asleep, or sleeping too much. ','select',choicesSet25),
  makeQuestion('5','Feeling tired or having little energy.','select',choicesSet25),
  makeQuestion('6','Poor appetite or overeating.','select',choicesSet25),
  makeQuestion('7','Feeling bad about yourself – or that  you are a failure or have let yourself or your family down. ','select',choicesSet25),
  makeQuestion('8','Trouble concentrating on things, such as reading the newspaper or watching television.  ','select',choicesSet25),
  makeQuestion('9',`Moving or speaking so slowly that other people 
could have noticed.  Or the opposite – being so 
fidgety or restless that you have been moving 
around a lot more than usual. `,'select',choicesSet25),
  makeQuestion('10','Thoughts that you would be better off dead, or of hurting yourself in some way. ','select',choicesSet25)
];
const anxietyQuestions: QuestionInterface[] = [
  makeQuestion('1','Feeling nervous, anxious, or on edge','select',choicesSet25),
  makeQuestion('2','Not being able to stop or control worrying','select',choicesSet25),
  makeQuestion('3','Worrying too much about different things','select',choicesSet25),
  makeQuestion('4','Trouble relaxing','select',choicesSet25),
  makeQuestion('5','Being so restless that it\'s hard to sit still','select',choicesSet25),
  makeQuestion('6','Becoming easily annoyed or irritable','select',choicesSet25),
  makeQuestion('7','Feeling afraid as if something awful might happen','select',choicesSet25),
  makeQuestion('8','If you checked off any problems, how difficult have these made it for you to do your work, take care of things at home, or long with other people?','select',choicesSet26),
];
const panicQuestions: QuestionInterface[] = [
  makeQuestion('1','In the last 4 weeks, have you had an anxiety attack - suddenly feeling fear or panic?','select',choicesSet29),
  makeQuestion('2','Has this ever happened before?','select',choicesSet29),
  makeQuestion('3','Do some of these attacks come suddenly out of the blue; that is, in situations where you don\'t expect to be nervous or uncomfortable?','select',choicesSet29),
  makeQuestion('4','Do these attacks bother you a lot or are you worried about having another attack?','select',choicesSet29),
  makeQuestion('5','Were you short of breath?','select',choicesSet29),
  makeQuestion('6','Did your heart race, pound, or skip?','select',choicesSet29),
  makeQuestion('7','Did you have chest pain or pressure?','select',choicesSet29),
  makeQuestion('8','Did you sweat?','select',choicesSet29),
  makeQuestion('9','Did you feel as if you were choking?','select',choicesSet29),
  makeQuestion('10','Did you have hot flashes or chills?','select',choicesSet29),
  makeQuestion('11','Did you have nausea or an upset stomach, or the feeling that you were going to have diarrhea?','select',choicesSet29),
  makeQuestion('12','Did you feel dizzy, unsteady, or faint?','select',choicesSet29),
  makeQuestion('13','Did you have tingling or numbness in parts of your body?','select',choicesSet29),
  makeQuestion('14','Did you tremble or shake?','select',choicesSet29),
  makeQuestion('15','Were you afraid you were dying?','select',choicesSet29)
];

const physicalInjuryAssessmentQs: QuestionInterface[] = [
  makeQuestion('1','In response to the stress of my physical injury, I tend to...','label'),
  makeQuestion('2','...take action to fix things.','select',choicesSet27),
  makeQuestion('3','...not give up trying to solve problems I think I can solve.','select',choicesSet27),
  makeQuestion('4','...find a way to do what\'s necessary to carry on.','select',choicesSet27),
  makeQuestion('5','...pray or meditate.','select',choicesSet27),
  makeQuestion('6','...face my fears.','select',choicesSet27),
  makeQuestion('7','...find opportunity for growth.','select',choicesSet27),
  makeQuestion('8','...calm and comfort myself.','select',choicesSet27),
  makeQuestion('9','...try to "recharge" myself before I have to face the next challenge.','select',choicesSet27),
  makeQuestion('10','...see it as a challenge that will make me better.','select',choicesSet27),
  makeQuestion('11','...look at the problem in a number of ways.','select',choicesSet27),
  makeQuestion('12','...look for creative solutions to the problem.','select',choicesSet27),
  makeQuestion('13','...put things in perspective and realize I will have times of joy and times of sadness.','select',choicesSet27),
  makeQuestion('14','...be good at determining which situations are changeable and which are not.','select',choicesSet27),
  makeQuestion('15','...find meaning from the experience.','select',choicesSet27),
  makeQuestion('16','...find strength in the meaning, purpose, or mission of my life.','select',choicesSet27),
  makeQuestion('17','...know I will bounce back.','select',choicesSet27),
  makeQuestion('18','...expect that I can handle it.','select',choicesSet27),
  makeQuestion('19','...learn important and useful life lessons.','select',choicesSet27),
  makeQuestion('20','...understand that bad things can happen to anyone, not just me.','select',choicesSet27),
  makeQuestion('21','...lean on my faith in God or a higher power.','select',choicesSet27),
  makeQuestion('22','...draw upon lessons learned from failures and past mistakes.','select',choicesSet27),
  makeQuestion('23','...practice ways to handle it better next time.','select',choicesSet27)
];

const resilienceAssessmentQs: QuestionInterface[] = [
  makeQuestion('1','During and after life’s most stressful events, I tend to...','label'),
  makeQuestion('2','...take action to fix things.','select',choicesSet27),
  makeQuestion('3','...not give up trying to solve problems I think I can solve.','select',choicesSet27),
  makeQuestion('4','...find a way to do what\'s necessary to carry on.','select',choicesSet27),
  makeQuestion('5','...pray or meditate.','select',choicesSet27),
  makeQuestion('6','...face my fears.','select',choicesSet27),
  makeQuestion('7','...find opportunity for growth.','select',choicesSet27),
  makeQuestion('8','...calm and comfort myself.','select',choicesSet27),
  makeQuestion('9','...try to "recharge" myself before I have to face the next challenge.','select',choicesSet27),
  makeQuestion('10','...see it as a challenge that will make me better.','select',choicesSet27),
  makeQuestion('11','...look at the problem in a number of ways.','select',choicesSet27),
  makeQuestion('12','...look for creative solutions to the problem.','select',choicesSet27),
  makeQuestion('13','...put things in perspective and realize I will have times of joy and times of sadness.','select',choicesSet27),
  makeQuestion('14','...be good at determining which situations are changeable and which are not.','select',choicesSet27),
  makeQuestion('15','...find meaning from the experience.','select',choicesSet27),
  makeQuestion('16','...find strength in the meaning, purpose, or mission of my life.','select',choicesSet27),
  makeQuestion('17','...know I will bounce back.','select',choicesSet27),
  makeQuestion('18','...expect that I can handle it.','select',choicesSet27),
  makeQuestion('19','...learn important and useful life lessons.','select',choicesSet27),
  makeQuestion('20','...understand that bad things can happen to anyone, not just me.','select',choicesSet27),
  makeQuestion('21','...lean on my faith in God or a higher power.','select',choicesSet27),
  makeQuestion('22','...draw upon lessons learned from failures and past mistakes.','select',choicesSet27),
  makeQuestion('23','...practice ways to handle it better next time.','select',choicesSet27)
];

const sleepAssessmentQs: QuestionInterface[] = [
  makeQuestion('1','I feel sleepy during the day, even when I get a good night\'s sleep.','select',choicesSet28),
  makeQuestion('2','I get very irritable when I can\'t sleep.','select',choicesSet28),
  makeQuestion('3','I often wake up at night and have trouble falling back to sleep.','select',choicesSet28),
  makeQuestion('4','It usually takes me a long time to fall asleep.','select',choicesSet28),
  makeQuestion('5','I often wake up very early and can\'t fall back to sleep.','select',choicesSet28),
  makeQuestion('6','I usually feel achy and stiff when I wake up in the morning.','select',choicesSet28),
  makeQuestion('7','I often seem to wake up because of dreams.','select',choicesSet28),
  makeQuestion('8','I sometimes wake up gasping for breath.','select',choicesSet28),
  makeQuestion('9','My bed partner says my snoring keeps her/him from sleeping.','select',choicesSet28),
  makeQuestion('10','I\'ve fallen asleep driving.','select',choicesSet28),
]

const generosityAssessmentQs: QuestionInterface[] = [
  makeQuestion('1','When one of my loved ones needs my attention, I really try to slow down and give them the time and help they need.','select',choicesSet12),
  makeQuestion('2','I am known by family and friends as someone who makes time to pay attention to others\' problems.','select',choicesSet12),
  makeQuestion('3','I\'m the kind of person who is willing to go the "extra mile" to help take care of my friends, relatives, and acquaintances.','select',choicesSet12),
  makeQuestion('4','When friends or family members experience something upsetting or discouraging, I make a special point of being kind to them.','select',choicesSet12),
  makeQuestion('5','When it comes to my personal relationships with others, I am a very generous person.','select',choicesSet12),
  makeQuestion('6','It makes me very happy to give to other people in ways that meet their needs.','select',choicesSet12),
  makeQuestion('7','It is just as important to me that other people around me are happy and thriving as it is that I am happy and thriving.','select',choicesSet12),
  makeQuestion('8','My decisions are often based on concern for the welfare of others.','select',choicesSet12),
  makeQuestion('9','I am usually willing to risk my own feelings being hurt in the process if I stand a chance of helping someone else I need.','select',choicesSet12),
  makeQuestion('10','I make it a point to let my friends and family know how much I love and appreciate them.','select',choicesSet12)
];

const optimismAssessmentQs: QuestionInterface[] = [
  makeQuestion('1','In uncertain times, I usually expect the best.','select',choicesSet40),
  makeQuestion('2','It\'s easy for me to relax.','select',choicesSet42),
  makeQuestion('3','If something can go wrong for me it will.','select',choicesSet41),
  makeQuestion('4','I am always optimistic about my future','select',choicesSet40),
  makeQuestion('5','I enjoy my friends a lot.','select',choicesSet42),
  makeQuestion('6','It\'s important for me to keep busy.','select',choicesSet42),
  makeQuestion('7','I hardly ever expect things to go my way.','select',choicesSet41),
  makeQuestion('8','I don\'t get upset too easily.','select',choicesSet42),
  makeQuestion('9','I rarely count on good things happening to me.','select',choicesSet41),
  makeQuestion('10','Overall, I expect more good things to happen to me than bad.','select',choicesSet40)
];

/////////////////////////////////////PORT of Drugs Assessments END

export interface AssessmentTreeInterface {
  [propName: string]: AssessmentInterface;
}

export const FriendShipAssessment = makeAssessment(1,'Friendship Scale', 0, 17, 24,FriendshipScaleList,1,friendShipQuestions,friendsImage);
export const MaritalAssessment = makeAssessment(2,'Marital Satisfaction', 2, 92, 158,MaritalSatisfactionList,1,maritalSatisfactionQuestions,marriageImage);
export const SocialSupportAssessment = makeAssessment(3,'Perceived Social Support', 12, 58, 84, PerceivedSocialSupportList, 1, percSocialSupportQuestions, socialImage);
export const PostDeploymentSocialSupportAssessment = makeAssessment(4,'Post Deployment Social Support', 15, 49, 75,PostDeploymentSocialSupportList, 0, postDepSupportQuestions,postDepSocialImage);
export const ParentingConfidenceAssessment = makeAssessment(5,'Parenting Confidence', 16, 60, 96,ParentingConfidenceList,1,parentingConfidenceAssessment,parentingConfidenceImage);
  

export const AlcoholDrugsAssessment = makeAssessment(6,'Alcohol and Drugs', 0, 22, 38, AlcoholDrugsList,0,alcDrugsQuestions,alcImage,calcAlcDrugQuestions,calcDrugsScore);
export const PostTraumaticStressAssessment =  makeAssessment(7,'Post-Traumatic Stress', 17, 39, 85,PostTraumaticStressList, 0, ptsQuestions, ptsImage);

export const DepressionAssessment =  makeAssessment(8,'Depression', 0, 10, 27,DepressionList, 0, depressionQuestions, depressImage);
export const AnxietyAssessment =  makeAssessment(9,'Anxiety', 0, 8.5, 21, AnxietyList, 0, anxietyQuestions,anxietyImage);
export const PanicAssessment =  makeAssessment(10,'Panic', 0, 31, 60, PanicList, 0, panicQuestions,panicImage,calcPanicQuestions, calcPanicScore);

export const PhysicalAssessment =  makeAssessment(11,'Physical Injury Resilience', 0, 60, 88, PhysicalInjuryResilienceList, 1, physicalInjuryAssessmentQs,physInjuryImage);

export const SleepAssessment =  makeAssessment(12,'Sleep', 0, 1.5, 10, SleepList, 0, sleepAssessmentQs,sleepImage);

export const AngerAssessment = makeAssessment(13,'Anger', 0, 32.5, 56, AngerList, 0, angerQuestions,panicImage);
export const StressAssessment = makeAssessment(14,'Stress', 0, 18, 40, StressList, 0, stressQuestions,stressImage);
export const StigmaAssessment = makeAssessment(15,'Stigma', 10, 27.5, 50, StigmaList, 0, stigmaQuestions,stigmaImage);
export const WorryAssessment = makeAssessment(16,'Worry', 16, 38, 80, WorryList, 0, worryAssessmentQs,stigmaImage);
export const ResilienceAssessment =  makeAssessment(17,'Resilience', 0, 60, 88, PhysicalInjuryResilienceList, 1, resilienceAssessmentQs,physInjuryImage);
export const ForgivenessAssessment =  makeAssessment(18,'Forgiveness', 0, 70, 126, ForgivenessList, 1, forgivenessQuestions,postDepSocialImage);
export const GratitudeAssessment =  makeAssessment(19,'Gratitude', 0, 38, 42, GratitudeList, 1, gratitudeAssessmentQs,socialImage);
export const GenerosityAssessment =  makeAssessment(20,'Generosity', 0, 51, 60, GenerosityList, 1, generosityAssessmentQs,friendsImage);
export const OptimismAssessment =  makeAssessment(21,'Optimism', 0, 16, 24, OptimismList, 1, optimismAssessmentQs, friendsImage);

const assessmentsRaw: AssessmentInterface[] = [
  FriendShipAssessment,
  MaritalAssessment,
  SocialSupportAssessment,
  PostDeploymentSocialSupportAssessment,
  ParentingConfidenceAssessment,
  AlcoholDrugsAssessment,
  PostTraumaticStressAssessment,
  DepressionAssessment, //TODO fix depression results page - and questions - Gauge indicator is missing
  AnxietyAssessment,
  PanicAssessment,
  PhysicalAssessment,
  SleepAssessment,
  AngerAssessment,
  StressAssessment,
  StigmaAssessment,
  WorryAssessment,
  ResilienceAssessment,
  ForgivenessAssessment,
  GratitudeAssessment,
  GenerosityAssessment,
  OptimismAssessment
];

//TODO
/*
Stress
Stigma
*/

const normalData = normalize(assessmentsRaw,assessmentListSchema);

export const assessments: AssessmentTreeInterface = normalData.entities.assessment;

export const assessmentIds = normalData.result;