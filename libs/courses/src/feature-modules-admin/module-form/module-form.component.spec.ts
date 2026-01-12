import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleFormComponent } from './module-form.component';
import { ModulesService } from '../../data-access';

describe('ModuleFormComponent', () => {
  let component: ModuleFormComponent;
  let fixture: ComponentFixture<ModuleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuleFormComponent],
      providers: [
        { provide: ModulesService, useValue: {} },
        { provide: Router, useValue: {} },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ModuleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
