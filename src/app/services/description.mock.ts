import { assignmentDescriptionSchema } from './descriptionSchema';
import { courseDescriptionSchema } from './descriptionSchema';
import { topicDescriptionSchema } from './descriptionSchema';
import { typeDescriptionSchema } from './descriptionSchema';

export const assignmentDescriptions: assignmentDescriptionSchema[] = [
  { name: 'Interview Report', institution: 'Purdue University', description: "An interview report on experts' opinions on students' research topics for synthesis and argument paper" },
  { name: 'Analytical Essay', institution: 'Northern Arizona University', description: 'An informational essay' },
  { name: 'Argumentative Paper', institution: 'Northern Arizona University', description: 'An argumentative paper with a clear position supported by credible sources in a sequenced writing project' },
  { name: 'Literature Review', institution: 'Purdue University', description: 'An organized review and/or synthesis of several articles on a related topic' },
  { name: 'Annotated Bibliography', institution: 'Purdue University', description: 'An annotated bibliography with a summary of sources with citations for argumentative papers' },
  { name: 'Annotated Bibliography', institution: 'Northern Arizona University', description: 'An annotated bibliography with a summary of sources with citations for argumentative papers' },
  { name: 'Research Proposal', institution: 'Purdue University', description: 'A proposal of research plans in a sequenced writing project, including working argument, backgrounds, and methods' },
  { name: 'Literacy Narrative', institution: 'Purdue University', description: "A narrative that describes students' literacy development in various academic and social contexts" },
  { name: 'Controversy Analysis', institution: 'Purdue University', description: "An objective analysis of a controversy in society and the arguments made supporting multiple perspectives" },
  { name: 'Case Study', institution: 'Purdue University', description: "A summary of a decided legal case and argument regarding the decision" },
  { name: 'Description and Explanation', institution: 'Purdue University', description: "A description and explanation of register choices made in a corresponding assignment ('Register Rewrite')" },
  { name: 'Film Analysis', institution: 'Purdue University', description: "An analysis of how a film achieves its purpose through rhetorical features such as, plot design, character development, setting, and visual aspects" },
  { name: 'Genre Analysis', institution: 'Purdue University', description: "An analysis of the characteristics of a particular genre, including register choices, organization, development, and multimodal elements" },
  { name: 'Genre Redesign', institution: 'Purdue University', description: "An adaptation of a previous writing project for a new genre. This project is sometimes accompanied by a reflective essay" },
  { name: 'Informative Essay', institution: 'Northern Arizona University', description: "An explanation without taking a side / position; demonstrates subject knowledge / control" },
  { name: 'Memo', institution: 'Purdue University', description: "A short summary of an article or topic intended for a professional (non-academic) audience" },
  { name: 'Narrative', institution: 'Purdue University', description: "A narrative reflecting on personal growth connected to experiences in a particular place" },
  { name: 'Open Letter', institution: 'Purdue University', description: "A letter intending to persuade a broad audience about a particular viewpoint on a contested topic" },
  { name: 'Public Argument', institution: 'Purdue University', description: "An argument intending to persuade a broad audience about a particular viewpoint on a contested topic, often in the form of a powerpoint or other digital format" },
  { name: 'Profile', institution: 'Purdue University', description: "A focused overview of a specific person or organization" },
  { name: 'Position Argument', institution: 'Purdue University', description: "An argumentative paper with a clear position related to World Englishes supported by a mix of scholarly references and personal experiences" },
  { name: 'Rhetorical Analysis', institution: 'Purdue University', description: "A breakdown of a text into rhetorical components to better understand how an author achieves their purpose" },
  { name: 'Rhetorical Analysis', institution: 'Northern Arizona University', description: "A breakdown of a text into rhetorical components to better understand how an author achieves their purpose.Typically uses ethos, logos pathos." },
  { name: 'Response', institution: 'Purdue University', description: "A summary and response to an article or other course text/video" },
  { name: 'Portfolio', institution: 'Purdue University', description: "Course-level reflective writing, sometimes completed as part of a final portfolio" },
  { name: 'Reflection/Portfolio', institution: 'Purdue University', description: "Course-level reflective writing, sometimes completed as part of a final portfolio" },
  { name: 'Research Proposal', institution: 'Purdue University', description: "A proposal for a research-based argument, based on preliminary research and research question(s)" },
  { name: 'Register Rewrite', institution: 'Purdue University', description: "A transformed version of a formal academic article into an informal register/genre" },
  { name: 'Summary and Response', institution: 'Purdue University', description: "A summary of a single article or media source and response to that source" },
  { name: 'Short Argument', institution: 'Northern Arizona University', description: "A (short) claim about a topic that is of interest to the student.This is often extended for the Argumentative Paper" },
  { name: 'Synthesis', institution: 'Purdue University', description: "A paper that reviews 3 published articles related to a research topic in a sequenced writing project" },
  { name: 'Text Analysis', institution: 'Purdue University', description: "An analysis of how literary devices are used to create a particular effect on its target audience" },
  { name: 'Variation Analysis', institution: 'Purdue University', description: "A comparative analysis of register differences between an academic article and an informal text" },
];

export const courseDescriptions: courseDescriptionSchema[] = [
  { course: 'ENGL 105', institution: 'Northern Arizona University', description: 'ENGL 105: 4-credit Foundations Writing course for domestic and international students at NAU' },
  { course: 'ENGL 106', institution: 'University of Arizona', description: 'ENGL 106: 3-credit Foundations Writing Course for International Students (1 of 3) at UA' },
  { course: 'ENGL 107', institution: 'University of Arizona', description: 'ENGL 107: 3-credit Foundations Writing Course for International Students (2 of 3) at UA' },
  { course: 'ENGL 108', institution: 'University of Arizona', description: 'ENGL 108: 3-credit Foundations Writing Course for International Students (3 of 3) at UA' },
  { course: 'ENGL 106i', institution: 'Purdue University', description: 'ENGL 106i: 4-credit foundations writing course for international students at Purdue' },
  { course: 'ENGL 102', institution: 'University of Arizona', description: 'ENGL 102: 3-credit Foundations Writing Course for Domestic Students (2 of 2) at UA'},
  { course: 'ENGL 101', institution: 'University of Arizona', description: 'ENGL 101: 3-credit Foundations Writing Course for Domestic Students (1 of 2) at UA'}
];

export const topicDescriptions: topicDescriptionSchema[] = [
  { topic: 'Digital Composition', description: 'Includes directions and models for digital and multimodal composition' },
  { topic: 'Language Awareness', description: 'Includes language related materials (e.g., grammar, word choice, register awareness)' },
  { topic: 'Peer Review', description: 'Includes peer review activities, directions, and examples, as well as materials for peer conferences' },
];


export const typeDescriptions: typeDescriptionSchema[] = [
  { type: 'Syllabus', description: 'Includes course syllabi, schedules, and policies' },
  { type: 'Lesson Plan', description: 'Includes presentations slides and class activities within those presentations' },
  { type: 'Assignment Sheet/Prompt', description: 'Assignment sheets/prompts for major writing assignments' },
  { type: 'Rubric', description: 'Grading rubrics (scales) and draft expectations for major assignments' },
  { type: 'Activity', description: 'Includes in-class activities, homework assignments, and peer review activities' },
  { type: 'Supporting Material', description: 'Materials intended to be used as a guide' },
  { type: 'Sample Paper', description: 'Sample work that may or may not have been written by students' },
];
