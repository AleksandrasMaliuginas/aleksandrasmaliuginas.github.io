"use strict";

load_data('exams.json');

async function load_data(data_path) {

  const response = await fetch(data_path);
  const data = await response.json();
  const subjects = Object.keys(data).slice(1);

  subjects.forEach(sub => {
    // Sort exams in descending order
    data[sub].sort((a, b) => b.Year - a.Year);

    // Add counts for rowspan when displaying in table
    countSameYearExams(data[sub]);

  });

  // Set file urls to local ones
  useLocalUrls(data, subjects);

  const vm = Vue.createApp({
    data() {
      return {
        documents: data.docs,
        subjects: subjects,
        selected: subjects[0],
        data: data,

        temp_year: 0,
      };
    },
    methods: {
      show: function (subject) {
        this.selected = subject;
        this.temp_year = 0;
      }
    }
  }).mount("#app");
}

function useLocalUrls(data, subjects) {
  const DIR = 'files/';

  subjects.forEach(sub => {
    data[sub].forEach(exam => {
      if (exam.TaskUrl) {
        exam.RemoteTaskUrl = exam.TaskUrl;
        exam.TaskUrl = DIR + [sub, exam.Year, exam.ExamType, 'UZD'].join("_") + '.pdf';
      }
      if (exam.AnswersUrl) {
        exam.RemoteAnswersUrl = exam.AnswersUrl;
        exam.AnswersUrl = DIR + [sub, exam.Year, exam.ExamType, 'VER'].join("_") + '.pdf';
      }
    });
  });
}

function countSameYearExams(data) {
  let lastRecord = {
    idx: 0,
    count: 1,
    year: data[0].Year
  }

  for (let i = 1; i < data.length; i++) {
    if (lastRecord.year !== data[i].Year) {
      data[lastRecord.idx].Count = lastRecord.count;

      lastRecord.idx = i;
      lastRecord.count = 1;
      lastRecord.year = data[i].Year;
    } else {
      lastRecord.count += 1;
    }
  }

  data[lastRecord.idx].Count = lastRecord.count;
}