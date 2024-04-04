import json
from pathlib import Path
from typing import Callable

EXAM_REGISTRY_FILE = "../exam-registry.json"
SUBJECT_KEY_TO_NAME = {
    "MAT": "Matematika",
    "IT": "Informacinės technologijos",
}
SESSION_KEY_TO_NAME = {
    "PGR": "Pagrindinė sesija",
    "PAK": "Pakartotinė sesija",
    "BAN": "Bandomoji sesija",
}


def main():
    pathList = Path("../files").glob("*.pdf")
    exam_registry = {}

    for path in pathList:
        filePath = str(path)

        filename = filePath.split("/")[2]
        subjectKey, year, sessionKey, type = filename.split(".")[0].split("-")
        # print(subjectKey, year, sessionKey, type)

        subject = appendIfAbsent(exam_registry, subjectKey, newSubject)
        yearExams = appendIfAbsent(subject["years"], year, newYear)
        session = appendIfAbsent(yearExams["exams"], sessionKey, newExamSession)

        if type == "UZD":
            session["file"] = filename

        if type == "VER":
            session["assessmentFile"] = filename

    exam_registry_json = json.dumps(exam_registry, indent=2, ensure_ascii=False)

    registry_file = open(EXAM_REGISTRY_FILE, "w")
    registry_file.write(exam_registry_json)
    registry_file.close()


def newSubject(subjectKey: str):
    return {
        "subject": SUBJECT_KEY_TO_NAME[subjectKey],
        "common_files": [],
        "years": {},
    }


def newYear(year: str):
    return {
        "exams": {},
    }


def newExamSession(sessionKey: str):
    return {
        "session": SESSION_KEY_TO_NAME[sessionKey],
        "file": None,
        "assessmentFile": None,
        "attachmentsUrl": None,
    }


def appendIfAbsent(targetDict: dict, entryKey: str, computeFunction: Callable[[str], dict]):
    if entryKey not in targetDict:
        targetDict[entryKey] = computeFunction(entryKey)

    return targetDict[entryKey]


if __name__ == "__main__":
    main()
