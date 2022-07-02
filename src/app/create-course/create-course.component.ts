import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AngularFirestore} from '@angular/fire/firestore';
import {Course} from '../model/course';
import {catchError, concatMap, last, map, take, tap} from 'rxjs/operators';
import {from, Observable, throwError} from 'rxjs';
import {Router} from '@angular/router';
import {AngularFireStorage} from '@angular/fire/storage';
import firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;
import { CoursesService } from '../services/courses.service';

@Component({
  selector: 'create-course',
  templateUrl: 'create-course.component.html',
  styleUrls: ['create-course.component.css']
})
export class CreateCourseComponent implements OnInit {

  courseId: string; 
  form = this.fb.group({
    description: ['', Validators.required],
    category: ["BEGINNER", Validators.required], 
    url: ['', Validators.required], 
    longDescription: ['', Validators.required], 
    promo: [false], 
    promoStartAt: [null]
  }); 

  constructor(
    private fb: FormBuilder,
    private coursesService: CoursesService,
    private afs: AngularFirestore, 
    private router: Router
    ) { }

  ngOnInit() {
    // creates a guid clientside for our id 
    this.courseId = this.afs.createId(); 
  }

  onCreateCourse() {
    // spread operator and as object to assign to variable 
    //const newCourse = { ...this.form.value } as Course;

    // here we use the form value to populate the course object 
    const value = this.form.value;

    const newCourse: Partial<Course> = {
      description: value.description, 
      url: value.url,
      longDescription: value.longDescription,
      promo: value.promo, 
      // as the category is an array we need to appraoch this value differently 
      categories: [value.category] 
    }
    // used to store JS DateTime in Firestore 
    newCourse.promoStartAt = Timestamp.fromDate(this.form.value.promoStartAt);
    console.log(newCourse);
    // our service to create 
    // Partial as it does not contain an id - as hasn't been created yet 
    this.coursesService.createCourse(newCourse, this.courseId).pipe(
      tap(course => {
        console.log("Created new course: ", course);
        this.router.navigateByUrl("/courses");
      }),
      catchError(error => {
        console.log(error);
        alert("Could not create the course");
        return throwError(error)
      })
    ).subscribe()
  }

}
