import { TestBed } from '@angular/core/testing';

import { DBService } from './db.service';
import { of } from 'rxjs';

describe('NewsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  // it('should be created', () => {
  //   const service: DBService = TestBed.get(DBService);
  //   expect(service).toBeTruthy();
  // });


  // let dbService:DBService;

  // beforeEach(() =>{
    
  //   TestBed.configureTestingModule({
  //     providers:[DBService]

  //   });

  //   dbService=TestBed.get(DBService);
  // });

  // it('should be created', () => {
  //   expect(dbService).toBeTruthy();
  // });

  // describe('getNews',()=>{
  //   it('should return a collection of news', ()=>{
  //     const news=[
  //       {
  //         author: 'John Doe',
  //         date: 'Mar 19, 2019',
  //         sortDate: 20190319,
  //         title: 'Delays'
  //       },
  //       {
  //         author: 'Jane Doe',
  //         date: 'Mar 31, 2019',
  //         sortDate: 20190331,
  //         title: 'More delays'
  //       }
  //     ];
  //     let response;
  //     spyOn(dbService,'getNews').and.returnValue(of(news));
  //     dbService.getNews().subscribe(res=>{
  //       response=res;
  //     });
  //     expect(response).toEqual(news);

  //   });

  // });
});
