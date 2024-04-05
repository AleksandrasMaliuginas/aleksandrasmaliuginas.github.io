"use strict";

const SUBJECT_TEMPLATE_HTML = "template.html";
const EXAMS_REGISTRY = "exam-registry.json";
const EXAM_SUBJECT = document.getElementById("app").getAttribute("exam_subject");
const SUBJECT_KEY_TO_NOBLE_NAME = {
  "MAT": "Matematikos",
  "IT": "Informacinių technologijų",
};


await loadSubjectTemplate();
await createVueApp(EXAM_SUBJECT);


async function loadSubjectTemplate() {
  const appHtml = document.getElementById("app");
  const template = await fetch(SUBJECT_TEMPLATE_HTML);

  appHtml.innerHTML = await template.text();
}

async function createVueApp(subjectKey) {

  if (!subjectKey) {
    return Vue.createApp({}).mount("#app");
  }

  const subjectExams = await fetchExamRegistry(EXAMS_REGISTRY);
  const actingSubject = subjectExams[subjectKey];
  const examsList = subjectExamsToList(actingSubject);

  document.title = actingSubject.subject

  return Vue.createApp({
    data() {
      return {
        subjectName: actingSubject.subject,
        nobleSubjectName: SUBJECT_KEY_TO_NOBLE_NAME[subjectKey],
        exams: examsList
      };
    }
  }).mount("#app");
}

function subjectExamsToList(subject) {
  const examsList = [];

  for (const [year, yearExams] of Object.entries(subject.years).sort(descending)) {

    const exams = Object.entries(yearExams.exams);
    let tableRowSpan = exams.length;

    for (const [sessionKey, session] of exams.sort(descending)) {

      const record = {
        tableRowSpan: tableRowSpan,
        year: year,
        examType: sessionKey,
        taskUrl: 'files/' + session.file,
        answersUrl: 'files/' + session.assessmentFile,
        fileName: session.file
      };

      tableRowSpan = 0;
      examsList.push(record);
    }
  }

  return examsList;
}


function ascending([keyStrA, valA], [keyStrB, valB]) {
  return keyStrB > keyStrA ? -1 : 1;
}

function descending([keyStrA, valA], [keyStrB, valB]) {
  return keyStrB < keyStrA ? -1 : 1;
}

async function fetchExamRegistry(registry_file_url) {
  const response = await fetch(registry_file_url);

  return await response.json();
}
