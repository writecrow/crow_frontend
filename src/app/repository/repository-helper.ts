import { Injectable } from "@angular/core";
@Injectable()
export class RepositoryHelper {

  getLabel(type, course, assignment, topic) {
    if (type === 'Syllabus') {
      return type.concat(': ' + course);
    }
    if (['Assignment Sheet/Prompt', 'Checklist', 'Supporting Material', 'Rubric', 'Sample Paper', 'Lesson Plan', 'Activity'].includes(type)) {
      if (assignment !== '') {
        return type.concat(': ' + assignment);
      }
      if (topic !== '') {
        return type.concat(' (' + topic + ')');
      }
    }
    if (type === 'Handout') {
      if (assignment !== '') {
        return type.concat(': ' + assignment);
      } else if (course !== '') {
        return type.concat(': ' + course);
      }
    }
    return type;
  }
}
