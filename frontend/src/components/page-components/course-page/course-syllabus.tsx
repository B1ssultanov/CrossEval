interface CourseSyllabusProps {
  syllabusId:number;
}

const CourseSyllabus = ({syllabusId}: CourseSyllabusProps) => {
  return (
    <div>
      <h2>Syllabus</h2>
      <p>Course syllabus goes here {syllabusId && syllabusId}</p>
    </div>
  );
}

export default CourseSyllabus;