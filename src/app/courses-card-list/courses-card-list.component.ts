import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {Course} from "../model/course";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import {EditCourseDialogComponent} from "../edit-course-dialog/edit-course-dialog.component";
import {catchError, tap} from 'rxjs/operators';
import {throwError} from 'rxjs';
import {Router} from '@angular/router';
import { CoursesService } from '../services/courses.service';

@Component({
    selector: 'courses-card-list',
    templateUrl: './courses-card-list.component.html',
    styleUrls: ['./courses-card-list.component.css']
})
export class CoursesCardListComponent implements OnInit {

    @Input()
    courses: Course[];

    @Output()
    courseEdited = new EventEmitter();

    @Output()
    courseDeleted = new EventEmitter<Course>();

    constructor(
      private dialog: MatDialog,
      private router: Router,
      private coursesService: CoursesService
      ) {
    }

    ngOnInit() {

    }

    ngAfterContentInit() {
        console.log(this.courses); 
    }

    editCourse(course:Course) {

        const dialogConfig = new MatDialogConfig();

        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        dialogConfig.minWidth = "400px";

        dialogConfig.data = course;

        this.dialog.open(EditCourseDialogComponent, dialogConfig)
            .afterClosed()
            .subscribe(val => {
                if (val) {
                    this.courseEdited.emit();
                }
            });

    }

    // used for deleting a single course - btn on line 27 
    onDeleteCourse(course: Course) {
        this.coursesService.deleteCourse(course.id)
            .pipe(
                tap(() => {
                    console.log("Course deleted: ", course);
                    this.courseDeleted.emit(course)
                }),
                catchError(error => {
                    console.log(error);
                    alert("Could not delete course");
                    return throwError(error)
                })
            )
            .subscribe(() => {
            })
    }

    // used for deleing course & nested collection of lessons within it  - btn on line 27 
    onDeleteCourseAndLessons(course: Course) {
        this.coursesService.deleteCourseAndLessons(course.id)
            .pipe(
                tap(() => {
                    console.log("Course deleted: ", course);
                    this.courseDeleted.emit(course)
                }),
                catchError(error => {
                    console.log(error);
                    alert("Could not delete course");
                    return throwError(error)
                })
            )
            .subscribe(() => {
            })
    }

}









