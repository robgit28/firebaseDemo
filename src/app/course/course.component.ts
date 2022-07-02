import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {finalize, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Lesson} from '../model/lesson';
import { CoursesService } from '../services/courses.service';


@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  // the course we wil display on this page 
  course: Course; 

  // the lessons to display
  lessons: Lesson[]; 

  // our loading spinner 
  loading = false;

  // infinite scroll position for pagination 
  lastPageLoaded = 0; 

  displayedColumns = ['seqNo', 'description', 'duration'];

  constructor(private route: ActivatedRoute, 
              private coursesService: CoursesService) { }

  ngOnInit() {
    // retrieve the course we want to display 
    // "course" has been filled in by the courseResolver  
    this.course = this.route.snapshot.data["course"]; 

    // indicates loading spinner before call to service is made
    this.loading = true; 

    // leave others params as default values 
    this.coursesService.findLessons(this.course.id)
      .pipe(
        // finalize RXJS operator 
        // removes loading spinner when call is finalized 
        finalize(() => this.loading = false
        )
      ).subscribe(
          lessons =>  this.lessons = lessons
      ); 
  }

  // pagination 
  loadMore() {
    this.lastPageLoaded++; 
    // initialize spinner before call to service 
    this.loading = true;
    this.coursesService.findLessons(this.course.id, "asc", this.lastPageLoaded)
    .pipe(
      finalize(()  => this.loading = false)
    ).subscribe(
      // adds new list / page of lessons on the currently displayed list / page of lessons 
      lessons => this.lessons = this.lessons.concat(lessons)
    )
  }

}
