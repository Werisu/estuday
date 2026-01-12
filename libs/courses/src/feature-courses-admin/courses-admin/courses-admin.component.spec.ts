import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CoursesAdminComponent } from './courses-admin.component';
import { CoursesService } from '../../data-access';

describe('CoursesAdminComponent', () => {
  let component: CoursesAdminComponent;
  let fixture: ComponentFixture<CoursesAdminComponent>;
  let coursesService: jasmine.SpyObj<CoursesService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    coursesService = jasmine.createSpyObj('CoursesService', [
      'loadCourses',
      'deleteCourse',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [CoursesAdminComponent],
      providers: [
        { provide: CoursesService, useValue: coursesService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CoursesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
