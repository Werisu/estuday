import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CourseFormComponent } from './course-form.component';
import { CoursesService } from '../../data-access';

describe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;
  let coursesService: jasmine.SpyObj<CoursesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    coursesService = jasmine.createSpyObj('CoursesService', [
      'createCourse',
      'updateCourse',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CourseFormComponent],
      providers: [
        { provide: CoursesService, useValue: coursesService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
