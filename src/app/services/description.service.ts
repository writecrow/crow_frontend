import { assignmentDescriptions } from '../services/description.mock';
import { courseDescriptions } from '../services/description.mock';
import { topicDescriptions } from '../services/description.mock';
import { typeDescriptions } from '../services/description.mock';
import { Injectable } from "@angular/core";

@Injectable()
export class assignmentDescriptionService {
  constructor() { }
  getDescription(name, institution = null): string {
    let output = [];
    let concatenatedOutput = [];
    for (const i in assignmentDescriptions) {
      if (institution != null) {
        // An institution parameter has been specified.
        // This would be used for individual search results.
        if (assignmentDescriptions[i].name === name && (assignmentDescriptions[i].institution === institution || assignmentDescriptions[i].institution === '')) {
          output.push(assignmentDescriptions[i]);
        }
      }
      else if (assignmentDescriptions[i].name === name) {
        // No institution parameter has been specified.
        // This would be used for faceted filters.
        output.push(assignmentDescriptions[i]);
        break;
      }
    }
    if (output.length === 1) {
      return output[0].description;
    }
    else {
      // Handle multiple matching institutions.
      for (const i of output) {
        if (i.institution === '') {
          concatenatedOutput.push(i.description);
        }
        concatenatedOutput.push(i.institution + ": " + i.description);
      }
      return concatenatedOutput.join('; ');
    }
  }
}

@Injectable()
export class courseDescriptionService {
  constructor() { }
  getDescription(course): string {
    for (const i in courseDescriptions) {
      if (courseDescriptions[i].course === course) {
        return courseDescriptions[i].description;
      }
    }
    return '';
  }
}

@Injectable()
export class topicDescriptionService {
  constructor() { }
  getDescription(key): string {
    for (const i in topicDescriptions) {
      if (topicDescriptions[i].topic === key) {
        return topicDescriptions[i].description;
      }
    }
    return '';
  }
}

@Injectable()
export class typeDescriptionService {
  constructor() { }
  getDescription(type): string {
    for (const i in typeDescriptions) {
      if (typeDescriptions[i].type === type) {
        return typeDescriptions[i].description;
      }
    }
    return '';
  }
}
