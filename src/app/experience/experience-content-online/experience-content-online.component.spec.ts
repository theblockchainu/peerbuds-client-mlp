import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceContentOnlineComponent } from './experience-content-online.component';

describe('ExperienceContentOnlineComponent', () => {
    let component: ExperienceContentOnlineComponent;
    let fixture: ComponentFixture<ExperienceContentOnlineComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ ExperienceContentOnlineComponent ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExperienceContentOnlineComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
