import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { LessonsAdminComponent } from './lessons-admin.component';
import { LessonsService, ModulesService, CoursesService } from '../../data-access';

describe('LessonsAdminComponent', () => {
  let component: LessonsAdminComponent;
  let fixture: ComponentFixture<LessonsAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LessonsAdminComponent],
      providers: [
        { provide: LessonsService, useValue: {} },
        { provide: ModulesService, useValue: {} },
        { provide: CoursesService, useValue: {} },
        { provide: Router, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: (key: string) => (key === 'courseId' ? '1' : 'm1'),
              },
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
