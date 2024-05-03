import Image from "next/image";
import folderRed from '../../public/images/folderRed.svg'
import folderBlue from '../../public/images/folderBlue.svg'
import folderGreen from '../../public/images/folderGreen.svg'

const CourseFolder = ({color, course}) => {
    // const courses = [["INF 123", "Backend", "Yedige Bissultanov", "red"], ["INF 321", "Big Data", "Khaled Mohamed", "green"], ["INF 111", "Frontend", "Mukan Zhanbolat", "blue"], ["INF 123", "Backend", "Yedige Bissultanov", "red"], ["INF 321", "Big Data", "Khaled Mohamed", "green"], ["INF 111", "Frontend", "Mukan Zhanbolat", "blue"],];
    
    let image = folderRed;
    if(color === "blue"){
        image = folderBlue;
    }else if(color === "green"){
        image = folderGreen;
    }

    return (
        <div className="mx-2 w-[145px] h-auto relative">
            <h1 className="absolute font-bold text-xl left-6 top-14 text-center">
                {course[1]}
            </h1>
            <p className="absolute text-[0.6rem] font-semibold left-6 top-36 text-center">
                {course[0]} <br></br> {course[2]} 
            </p>
            <Image
                src={image}
                alt="course"
                className="h-full w-full"
            />
        </div>
    );
};

export default CourseFolder;
