import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEquipment } from './equipment-dialof';

describe('EditEquipment', () => {
  let component: EditEquipment;
  let fixture: ComponentFixture<EditEquipment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditEquipment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditEquipment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
