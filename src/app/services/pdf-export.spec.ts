import { TestBed } from '@angular/core/testing';

import { PdfExport } from './pdf-export';

describe('PdfExport', () => {
  let service: PdfExport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PdfExport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
