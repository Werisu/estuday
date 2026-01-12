import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CoursesService } from '../../data-access';
import { CourseListComponent } from './course-list.component';

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let coursesService: jasmine.SpyObj<CoursesService>;

  beforeEach(async () => {
    coursesService = jasmine.createSpyObj('CoursesService', ['loadCourses'], {
      courses: jasmine.createSpy().and.returnValue([]),
      isLoading: jasmine.createSpy().and.returnValue(false),
      error: jasmine.createSpy().and.returnValue(null),
    });

    await TestBed.configureTestingModule({
      imports: [CourseListComponent],
      providers: [{ provide: CoursesService, useValue: coursesService }],
    }).compileComponents();

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
