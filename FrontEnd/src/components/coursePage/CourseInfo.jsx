import bgImage from '../../../public/images/courseBg.png';
import Image from 'next/image';
const CourseInfo = ({courseInfo}) => {
    // ["INF 123", "Backend", "Yedige Bissultanov", "red"]
    console.log(courseInfo)
    return (
        <div
            className="relative w-[100%] h-[100px] rounded-3xl mt-2 mb-2"
        >
            
            <h1 className='text-white font-extrabold text-2xl z-10 relative ml-6 mt-4'>{courseInfo[0]} <br></br> {courseInfo[1]}</h1>
            <div className='absolute inset-0'>
                <Image
                    src={bgImage}
                    alt="Background Image"
                    layout="fill"
                    objectFit="cover"
                    className="object-cover w-full h-full z-0 rounded-3xl"
                />
            </div>

        </div>
    );
};

export default CourseInfo;