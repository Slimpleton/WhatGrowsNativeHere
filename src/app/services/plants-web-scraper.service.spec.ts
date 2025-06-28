import { TestBed } from '@angular/core/testing';

import { PlantsWebScraperService } from './plants-web-scraper.service';

describe('PlantsWebScraperService', () => {
  let service: PlantsWebScraperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlantsWebScraperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
