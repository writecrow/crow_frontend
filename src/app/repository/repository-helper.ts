export class RepositoryHelper {
 
  getLabel(type, course, assignment) {
    if (type == 'Syllabus') {
      return type.concat(': ' + course);
    }
    if (['Assignment Sheet', 'Checklist', 'Peer Review Form', 'Rubric', 'Sample Work', 'Lesson Plan', 'Activity'].includes(type)) {
      return type.concat(': ' + assignment);
    }
    if (type == 'Handout') {
      if (assignment != '') {
        return type.concat(': ' + assignment);
      }
      else if (course != '') {
        return type.concat(': ' + course);
      }
    }
    return type;
  }
}