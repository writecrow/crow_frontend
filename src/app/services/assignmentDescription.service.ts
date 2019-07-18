import { mockAssignmentDescriptions } from './mock.assignmentDescriptions';

export class AssignmentDescriptionService {

  constructor() { }

  getDescription(name, institution): string {
    for (var i in mockAssignmentDescriptions) {
      if (mockAssignmentDescriptions[i].name == name) {
        return mockAssignmentDescriptions[i].description;
      }
    }
    return '';
  }

}