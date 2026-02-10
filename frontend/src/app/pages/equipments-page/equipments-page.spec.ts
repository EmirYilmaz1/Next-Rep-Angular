import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EquipmentsPage } from './equipments-page';

describe('EquipmentsPage', () => {
  let component: EquipmentsPage;
  let fixture: ComponentFixture<EquipmentsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipmentsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EquipmentsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
