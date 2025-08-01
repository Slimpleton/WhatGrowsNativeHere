import { Component } from '@angular/core';

@Component({
  selector: 'plant-search',
  imports: [],
  templateUrl: './plant-search.component.html',
  styleUrl: './plant-search.component.css'
})
export class PlantSearchComponent {

  
  // TODO sorting system, want to be able to sort by common name / scientific name asc / desc
  // TODO swap between user location and specific location // county and state
  // TODO figure out use case when the plant is native to state but has no county data? do i just include all or none for now
  // TODO filtering system, make maybe the thing and above both into the search service??
  // TODO use input output to input unfiltered stuff output filtered stuff and display on the same html?? might work idk

}
