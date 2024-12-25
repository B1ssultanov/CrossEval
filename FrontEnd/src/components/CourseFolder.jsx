import Image from "next/image";
import folderRed from '../../public/images/folderRed.svg'
import folderBlue from '../../public/images/folderBlue.svg'
import folderGreen from '../../public/images/folderGreen.svg'

const CourseFolder = ({ color, course }) => {
    let image = folderRed;
    if (color === "blue") {
        image = folderBlue;
    } else if (color === "green") {
        image = folderGreen;
    }

    function truncateText(text, limit) {
        if (text.length <= limit) {
          return text;
        }
        return text.slice(0, limit) + '...';
      }
      
      // Example usage:


      
    return (
        <div className="w-[220px]  h-[300px] relative flex flex-col items-center justify-evenly">
            <h1 className=" text-lg font-bold text-pretty w-[75px] text-gray-700 flex justify-center z-10">
                {truncateText(course[1], 10)}
            </h1>
            <p className="text-[0.9rem] leading-4 font-semibold  text-gray-600   w-[40px] flex justify-center z-10 text-center">
                {course[0]} <br /> {course[2]}
            </p>
            <Image
                src={image}
                alt="course"
                className="w-[220px] absolute z-0"
                
            />
        </div>
    );
};

export default CourseFolder;
