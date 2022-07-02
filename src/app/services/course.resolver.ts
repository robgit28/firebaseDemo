import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CoursesService } from '../services/courses.service';
import { Course } from '../model/course';
//import { resolve } from 'dns';
import { Observable } from 'rxjs';

// all services have @Injectable to ensure the service si svailable across our app 
@Injectable({
    providedIn: "root"
})

// Resolve<> interface transforms our service into a Resolver
// we pass in the data that the Resolver is fetching from the DB 
// allows us to navigate to the page of our course - will be needed for blog & job posts 
export class CourseResolver implements Resolve<Course> {

    constructor(
        private coursesService: CoursesService) { }
    

    // our resolve method 
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Course> {
        // need to determine which course to load from the DB based on the URL of the page we are on 
        // each course in our DB has a URL property associated with it 
        // paramMap - route path params 
        // "CourseUrl" defined in our Router module under its component 
        const courseUrl = route.paramMap.get("courseUrl"); 

        return this.coursesService.findCourseByUrl(courseUrl); 
    }


}