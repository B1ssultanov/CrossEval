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

    return (
        <div className="w-[220px] h-auto relative">
            <h1 className="absolute text-lg font-bold left-16 top-20 text-pretty w-[75px] text-gray-700 flex justify-center">
                {course[1]}
            </h1>
            <p className="absolute text-[0.9rem] leading-4 font-semibold left-20 text-gray-600 top-56  w-[40px] flex justify-center text-center">
                {course[0]} <br /> {course[2]}
            </p>
            <Image
                src={image}
                alt="course"
                className="w-[220px]"
                
            />
        </div>
    );
};

export default CourseFolder;
