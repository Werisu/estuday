import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ModulesAdminComponent } from './modules-admin.component';
import { ModulesService, CoursesService } from '../../data-access';

describe('ModulesAdminComponent', () => {
  let component: ModulesAdminComponent;
  let fixture: ComponentFixture<ModulesAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulesAdminComponent],
      providers: [
        { provide: ModulesService, useValue: {} },
        { provide: CoursesService, useValue: {} },
        { provide: Router, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '1' } },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModulesAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
