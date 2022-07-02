import {Component, Inject, OnInit} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import {AngularFireStorage} from '@angular/fire/storage';
import {Observable} from 'rxjs';
import { CoursesService } from '../services/courses.service';


@Component({
    selector: 'edit-course-dialog',
    templateUrl: './edit-course-dialog.component.html',
    styleUrls: ['./edit-course-dialog.component.css']
})
export class EditCourseDialogComponent {

    form: FormGroup; 
    course: Course; 
    constructor(
        // our reference to the dialog window 
        private dialogRef: MatDialogRef<EditCourseDialogComponent>, 
        private fb: FormBuilder, 
        private coursesService: CoursesService, 
        // inject our course information into this component 
        // inject token - MAT_DIALOG_DATA 
        @Inject(MAT_DIALOG_DATA) course: Course, 
    ) {
        this.course = course; 
        this.form = this.fb.group({
            description: [course.description, Validators.required],
            longDescription: [course.longDescription, Validators.required],
            promo: [course.promo]
        })
    }

    ngOnInit(): void {

    }

    onClose() {
      this.dialogRef.close(); 
    }

    // edit / update method 
    onSave() {
        // access the chaged form values 
        const changes = this.form.value; 

        this.coursesService.updateCourse(this.course.id, changes)
            .subscribe(() => {
                this.dialogRef.close(changes); 
            })
    }
}






