/**
 * @file book.ts
 * File in charge of listing resources for the assessment module.
 
 * Name: book.ts
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
import * as libraries from './libraryData';

export interface BookInterface{
  id: number;
  title: string;
  description: string;
  pages: BookPageInterface[];
}

export interface BookPageInterface{
  id: number;
  title: string;
  content: string;
}

const makeBook = (id:number, title:string, description: string, pages: BookPageInterface[] = []): BookInterface => {
  return {
    id,
    title,
    description,
    pages
  }
}

const makePage = (id:number, title:string, content: string): BookPageInterface => {
  return {
    id,
    title,
    content
  }
}

export class Library{
  private libData : BookInterface;
  private pages : BookPageInterface[];
  constructor(slug){
    let data = libraries[slug + 'Lib'],
      pages = data.pages.map(page => {
      return makePage(page.id,page.title,page.content);
    });
    this.libData = makeBook( data.id, data.title, data.content, pages );
  }
  get(){
    return this.libData;
  }
}


