import { Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/firestore";
// import { OrderByDirection } from "@google-cloud/firestore";
// import { OrderByDirection } from '@firebase/firestore-types';
import firebase from "firebase"; 
import OrderByDirection = firebase.firestore.OrderByDirection; 
import { from, Observable } from "rxjs";
import { concatMap, map } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { convertSnaps } from "./db-utils";
         

@Injectable({
    providedIn: "root"
})

export class CoursesService {

    constructor(
        private db: AngularFirestore) {
    }

    // allows us to fetch the pages of the course
    // OrderByDirection can be ascending or descending 
    // pagesize = number of items on each page 
    // emits / returns value of page of lessons  
    findLessons(courseId: string, sortOrder: OrderByDirection = "asc", pageNumber = 0, pagesize = 3): Observable<Lesson[]> {
        // access collection api method
        // access the lessons of the course
        return this.db.collection(`courses/${courseId}/lessons`, 
            // query function 
            // orderBy seqNo field
            ref => ref.orderBy("seqNo", sortOrder)
            // specifies pageSize
            .limit(pagesize)
            .startAfter(pageNumber * pagesize)
        )
        // gets values from DB 
        .get()
        .pipe(
            // convert to lit of lessons 
            map(results => convertSnaps<Lesson>(results))
        )
    }

    // returns one entity from the DB 
    // returns a Course object or null if a Course cannot be found
    findCourseByUrl(courseUrl: string): Observable<Course | null> {
        // access the collection 
        return this.db.collection("courses", 
        // find where the url in the DB matches the url we pass in 
          ref => ref.where("url", "==", courseUrl))
          .get()
          .pipe(
              map(results => {
                  // get list of matching courses - will be an array of 1 
                  const courses = convertSnaps<Course>(results); 
                  // if we find just one courses then return that, otherwise return null 
                  return courses.length == 1 ? courses[0] : null; 
              })
          )
        return ; 
    }

    // delete document and nested collections 
    deleteCourseAndLessons(courseId: string) {
        // path to the all of the lessons of a given course 
        return this.db.collection(`courses/${courseId}/lessons`)
            .get().pipe(
                concatMap(results => {
                    //gives us an array of lessons 
                    const lessons = convertSnaps<Lesson>(results);
                    // our batch write 
                    const batch = this.db.firestore.batch();
                    // the reference to the course we want to delete 
                    const courseRef = this.db.doc(`courses/${courseId}`).ref;
                    // atomic - all or nothing 
                    batch.delete(courseRef);
                    // loop through all the lessons of the course 
                    for (let lesson of lessons) {
                        // our reference to the lessons collection / doc
                        const lessonRef = this.db.doc(`courses/${courseId}/lessons/${lesson.id}`).ref;
                        batch.delete(lessonRef);
                    }
                    // commits it to the DB
                    // returns a promise 
                    // from() used to convert Promise to Observable 
                    return from(batch.commit()); 
                })
            )
    }

    // delete method 
    deleteCourse(courseId: string) {
        // returns a promise, which we convert to an observable using rxjs from()
        return from(this.db.doc(`courses/${courseId}`).delete()); 
    }
    // edit / update method 
    // observable - boolean if update was successful 
    updateCourse(courseId: string, changes: Partial<Course>): Observable<any> {
        // use the Angulare Firestore service to access the document we want to update 
        // call update() api and pass in the changes to the doc
        // returns a promise, which we convert to an observable using rxjs from()
        return from(this.db.doc(`courses/${courseId}`).update(changes)); 
    }

    // create method 
    createCourse(newCourse: Partial<Course>, courseId?: string) {
        // access the course collection 
        return this.db.collection(
            // query function 
            // query the seqNo property to obtain the highest int and then use +1 to create a sequential object 
            "courses", ref => ref.orderBy("seqNo", "desc").limit(1))
            // get observable 
            .get()
            .pipe(
                // ideal for save operations - creates new observable 
                concatMap(result => {
                    // gives us an array of course tthat match our above criteria 
                    const courses = convertSnaps<Course>(result);
                    // if there are no courses yet in the query then mark as optional and set default as 0 
                    const lastCourseSeqNo = courses[0]?.seqNo ?? 0;
                    // the course we are creating 
                    const course = {
                        // creates shallow copy 
                        ...newCourse,
                        seqNo: lastCourseSeqNo + 1
                    }
                    // our save observable 
                    let save$: Observable<any>;
                    // if we have the courseId ...
                    if (courseId) {
                        // set() api method to set the data into this path
                        // from() truns it into observable and we assign to save$ obseravble  
                        save$ = from(this.db.doc(`courses/${courseId}`).set(course));
                        // if we don't have the courseId ...
                    } else {
                        // use the collection api method 
                        // if no courseId use add() method and DB will create a id / guid 
                        save$ = from(this.db.collection("courses").add(course));
                    }
                    return save$.pipe(
                        map(
                            response => {
                                return {
                                    // covers if else - with/without courseId
                                    id: courseId ?? response.id,
                                    // our inserted data 
                                    ...course
                                }
                            }
                        )
                    );
                })
            )
    }

    // read method 
    loadCoursesByCategory(category: string): Observable<Course[]> {
        return this.db.collection(
            "courses",
            // needs a composite index set up in Firestore dashboard 
            ref => ref.where("categories", "array-contains", category)
                .orderBy("seqNo")
        ).get()
            // need to use pipe & map to transform the backend model to the front end model 
            .pipe(
                map(result => convertSnaps<Course>(result)
                )
            )
    }

}