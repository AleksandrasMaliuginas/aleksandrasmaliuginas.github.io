from enum import Enum
import json
import os
from pathlib import Path
from typing import Callable

EXAM_FILES_DIR = "../files/"
EXAM_REGISTRY_FILE = "../exam-registry.json"


class FileType(Enum):
    UZD = "taskFile"
    VER = "assessmentFile"
    PRD = "attachmentsFile"

    def keys():
        return FileType._member_names_


class Subject(Enum):
    MAT = "Matematika"
    IT = "Informacinės technologijos"

    def __init__(self, name: str):
        Enum.__init__(name)
        self.usedFileTypes = dict.fromkeys(FileType.keys(), False)


def main():
    exam_registry = {}

    for root, subdirs, files in os.walk(EXAM_FILES_DIR):
        for file in files:
            filePath = str(Path(root, file))

            filename = filePath.split("/")[-1]
            subjectKey, year, sessionKey, fileType = filename.split(".")[0].split("-")
            # print(subjectKey, year, sessionKey, fileType)

            subject = appendIfAbsent(exam_registry, subjectKey, newSubject)
            yearExams = appendIfAbsent(subject["years"], year, newYear)
            session = appendIfAbsent(yearExams["exams"], sessionKey, newExamSession)

            setSessionFileField(session, filePath, subjectKey, fileType)

    setFileTypesUsed(exam_registry)

    exam_registry_json = json.dumps(exam_registry, indent=2, ensure_ascii=False)

    registry_file = open(EXAM_REGISTRY_FILE, "w")
    registry_file.write(exam_registry_json)
    registry_file.close()


def setFileTypesUsed(examRegistry: dict):
    for subject in Subject:
        usedFileTypes: list = examRegistry[subject.name]["usedFileTypes"]

        for field, initialized in subject.usedFileTypes.items():
            if initialized:
                usedFileTypes.append(FileType[field].value)


def setSessionFileField(session: dict, filePath: str, subjectKey: str, fileType: str):
    for type in FileType:
        if fileType == type.name:
            session[type.value] = filePath.replace("../", "")
            Subject[subjectKey].usedFileTypes[type.name] = True


def newSubject(subjectKey: str):
    return {
        "subject": Subject[subjectKey].value,
        "usedFileTypes": [],
        "years": {},
    }


def newYear(year: str):
    return {
        "exams": {},
    }


def newExamSession(sessionKey: str):
    return {
        FileType.UZD.value: None,
        FileType.VER.value: None,
        FileType.PRD.value: None,
    }


def appendIfAbsent(targetDict: dict, entryKey: str, computeFunction: Callable[[str], dict]):
    if entryKey not in targetDict:
        targetDict[entryKey] = computeFunction(entryKey)

    return targetDict[entryKey]


if __name__ == "__main__":
    main()
