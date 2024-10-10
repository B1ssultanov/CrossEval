import OneCrossCheck from "@/components/coursePage/OneCrossCheck";

const CrossChecks = ({ data }) => {
    
    return (
        data.length ? (
            <div className="flex flex-col items-center">
            <div className="w-full h-[30px] font-semibold mt-3 mb-3 pl-2 pr-2 flex items-center justify-between text-[11px] ">
                <div className="w-[70px]">Status</div>
                <div className="w-[95px]">Title</div>
                <div className="w-[70px]">Type</div>
                <div className="w-[55px]">Start date</div>
                <div className="w-[55px]">End date</div>
                <div>Weight</div>
            </div>

            {data.map((assignment, index) => (
                <OneCrossCheck data={assignment} key={assignment.id} index={index} />
            ))}
        </div>
        ) : (
            <div className="w-full flex justify-center h-[40vh] items-center uppercase text-gray-500 text-3xl">No assignments yet</div>
        )
       
    );
};

export default CrossChecks;
