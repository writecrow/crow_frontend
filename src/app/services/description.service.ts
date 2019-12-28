import { assignmentDescriptions } from '../services/description.mock';
import { courseDescriptions } from '../services/description.mock';
import { topicDescriptions } from '../services/description.mock';
import { typeDescriptions } from '../services/description.mock';

export class assignmentDescriptionService {
  constructor() { }
  getDescription(name, institution): string {
    for (const i in assignmentDescriptions) {
      if (assignmentDescriptions[i].name === name) {
        return assignmentDescriptions[i].description;
      }
    }
    return '';
  }
}

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
