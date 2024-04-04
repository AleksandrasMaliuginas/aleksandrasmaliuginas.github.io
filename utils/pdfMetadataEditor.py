from pathlib import Path
from datetime import datetime
from PyPDF2 import PdfReader, PdfWriter


def main():
    pathList = Path("../files").glob("*.pdf")

    for path in pathList:
        filePath = str(path)

        filename = filePath.split("/")[2]
        subjectKey, year, session, type = filename.split(".")[0].split("-")

        keyToSubjectName = {"MAT": "Matematika", "IT": "Informacinės technologijos"}

        modifyMetadata(filePath, keywords=f"VBE, {year}, {keyToSubjectName[subjectKey]}")


def modifyMetadata(filePath: str, keywords: str):

    reader = PdfReader(filePath)
    writer = PdfWriter()

    # Add all pages to the writer
    for page in reader.pages:
        writer.add_page(page)

    filename = filePath.split("/")[-1]

    # Format the current date and time for the metadata
    utc_time = ""  # "-05'00'"  # UTC time optional
    time = datetime(2024, 1, 1, 0, 0, 0, 0).strftime(f"D\072%Y%m%d%H%M%S{utc_time}")

    # Add the metadata
    writer.add_metadata(
        {
            "/Title": filename,
            "/Author": "Nacionalinė švietimo agentūra",
            "/Producer": "Nacionalinė švietimo agentūra",
            "/CreationDate": time,
            "/Keywords": keywords,
        }
    )

    # Save modified PDF
    with open(filePath, "wb") as f:
        writer.write(f)


if __name__ == "__main__":
    main()
