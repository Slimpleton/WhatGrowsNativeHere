import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlantSearchService {
  // TODO sorting system, want to be able to sort by common name / scientific name asc / desc
  // TODO swap between user location and specific location // county and state
  // TODO figure out use case when the plant is native to state but has no county data? do i just include all or none for now
  // TODO filtering system, make maybe the thing and above both into the search service??


}
