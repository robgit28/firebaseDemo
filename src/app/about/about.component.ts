import {Component, OnInit} from '@angular/core';


import 'firebase/firestore';

import {AngularFirestore} from '@angular/fire/firestore';
import {COURSES, findLessonsForCourse} from './db-data';


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent {

    // Angular Firestore Module 
    constructor(private db: AngularFirestore) {
    }

    //used to populate data in the DB 
    async uploadData() {
        const coursesCollection = this.db.collection('courses');
        const courses = await this.db.collection('courses').get();
        for (let course of Object.values(COURSES)) {
            const newCourse = this.removeId(course);
            const courseRef = await coursesCollection.add(newCourse);
            const lessons = await courseRef.collection('lessons');
            const courseLessons = findLessonsForCourse(course['id']);
            console.log(`Uploading course ${course['description']}`);
            for (const lesson of courseLessons) {
                const newLesson = this.removeId(lesson);
                delete newLesson.courseId;
                await lessons.add(newLesson);
            }
        }
    }

    removeId(data: any) {
        const newData: any = {...data};
        delete newData.id;
        return newData;
    }

    // read a single document  object 
    onReadDoc() {
        // doc() used to read a single document from the DB and pass in the path 
        // get() returns an observable 
        this.db.doc("/courses/CQWd09zoLyZiL84tHcr5").get()
            .subscribe(snap => {
            // .data - returns the data in the object
            // .id returns the id of the object 
                console.log(snap.data()); 
                console.log(snap.id); 
        })
    }

    // read a collection of documents / objects
    onReadCollection() {
        // collection() used to read a group of documents 
        // get() returns an observable 
        this.db.collection("courses").get()
            .subscribe(snaps => {
                // .empty - let us know if it the collection is empty of not 
                // use .forEach to loop through and access each document 
                snaps.forEach(snap => {
                    console.log(snap.data());
                    console.log(snap.id);
                })
            })
    }

    // read a FILTERED collection 
    onReadFilteredCollection() {
        // collection() used to read a group of documents 
        // get() returns an observable     
        this.db.collection("/courses/CQWd09zoLyZiL84tHcr5/lessons",
        // pass in a second argument, a function 
        // model property, operator, value 
            ref => ref.where("seqNo", "==", 1))
            .get().subscribe(snaps => {
                // .empty - lets us know if it the collection is empty of not 
                // use .forEach to loop through and access each document 
                snaps.forEach(snap => {
                    console.log(snap.data());
                    console.log(snap.id);
                })
            })
    }

    // read a FILTERED collection with ORDERBY
    onReadFilteredOrderedCollection() {
        // collection() used to read a group of documents 
        // get() returns an observable     
        this.db.collection("/courses/CQWd09zoLyZiL84tHcr5/lessons",
        // pass in a second argument, a function 
        // model property, operator, value 
        // orderBy() takes the property field we want to oder by 
            ref => ref.where("seqNo", "<=", 5).orderBy("seqNo"))
            .get().subscribe(snaps => {
                // .empty - lets us know if it the collection is empty of not 
                // use .forEach to loop through and access each document 
                snaps.forEach(snap => {
                    console.log(snap.data());
                    console.log(snap.id);
                })
            })
    }


    // read a FILTERED collection with TWO FILTERS 
    // we will nedd to create a composite index in the Firestore DB to enable this 
    onReadMultipleFilteredCollection() {
        // collection() used to read a group of documents 
        // get() returns an observable     
        this.db.collection("courses",
        // pass in a second argument, a function 
        // model property, operator, value 
        // orderBy() takes the property field we want to oder by 
            ref => ref.where("seqNo", "<=", 5)
                .where("url", "==", "stripe-course")
                .orderBy("seqNo"))
            .get().subscribe(snaps => {
                // .empty - lets us know if it the collection is empty of not 
                // use .forEach to loop through and access each document 
                snaps.forEach(snap => {
                    console.log(snap.data());
                    console.log(snap.id);
                })
            })
    }

    // collection group query 
    onReadCollectionGroup() {
        this.db.collectionGroup("lessons", 
        ref => ref.where("seqNo", "==", 1))
        .get().subscribe(snaps => {
            snaps.forEach(snap => {
                console.log(snap.id);
                console.log(snap.data()); 
            })
        })
    }

    // read a single document object in realtime with id 
    // need to unsubscribe as remains open 
    onReadRealtimeDoc() {
        // doc() used to read a single document from the DB and pass in the path 
        // snapshotChanges() returns an observable intially and whenever the DB value changes 
        this.db.doc("/courses/CQWd09zoLyZiL84tHcr5")
            .snapshotChanges()
            .subscribe(snap => {
                // we now need to access the payload property 
            // .payload.data - returns the data in the object
            // .payload.id returns the id of the object 
                console.log(snap.payload.data()); 
                console.log(snap.payload.id); 
        })
    }

    // read a single document object in realtime WITHOUT id 
    // need to unsubscribe as remains open 
    onReadRealtimeDoc2() {
        // doc() used to read a single document from the DB and pass in the path 
        // valueChanges() returns an observable intially and whenever the DB value changes 
        this.db.doc("/courses/CQWd09zoLyZiL84tHcr5")
            .valueChanges()
            .subscribe(course => {
                console.log(course); 
                console.log(course); 
        })
    }
}
















