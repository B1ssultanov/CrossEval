// const OneCrossCheck = ({ data, index }) => {

//     const getStatusColor = () => {
//         let statusColor = "bg-yellow-500";
//         if (data.status === "Submitted") statusColor = "bg-green-600";
//         else if (data.status === "Available") statusColor = "bg-yellow-400";
//         else if (data.status === "Done") statusColor = "bg-green-500";
//         else if (data.status === "Missed") statusColor = "bg-red-600";
//         else statusColor = "bg-blue-400";
//         return statusColor;
//     };

//     const getBgColor = () => {
//         let bg = "bg-white";
//         if (index % 2 === 0) {
//             bg = "bg-[#EBEEF3]";
//         }
//         return bg;
//     }

//     console.log(data);

//     const cutTitle = () => {
//         let text = data.title;
//         if (data.title.length > 15) {
//             text = `${data.title.substring(0, 15)}...`;
//         }

//         return text;
//     };

//     return (
//         <div
//             className={`w-full h-[40px] flex  text-[10px] items-center justify-between ${getBgColor()} rounded-xl pl-2 pr-2`}
//         >
//             <div className="flex items-center justify-start space-x-1 w-[70px]">
//                 <div
//                     className={`w-[7px] h-[7px] flex items-center justify-center rounded-full ${getStatusColor()}`}
//                 ></div>
//                 <div className="w-[57px]">{data.status}</div>
//             </div>
//             <div className="w-[95px]">{cutTitle()}</div>
//             <div className="w-[70px]">{data.type}</div>
//             <div className="w-[55px] break-words flex items-center text-center mr-2">{data.startDate}</div>
//             <div className="w-[55px] break-words flex items-center text-center">{data.endDate}</div>
//             <div>{data.weight}</div>
//         </div>
//     );
// };

// export default OneCrossCheck;

const OneCrossCheck = ({ data, index }) => {
    const getStatusColor = () => {
        switch (data.status) {
            case "Submitted":
                return "bg-green-600";
            case "Available":
                return "bg-yellow-400";
            case "Done":
                return "bg-green-500";
            case "Missed":
                return "bg-red-600";
            default:
                return "bg-blue-400";
        }
    };

    const getBgColor = () => {
        return index % 2 === 0 ? "bg-[#EBEEF3]" : "bg-white";
    };

    const cutTitle = () => {
        return data.title.length > 15
            ? `${data.title.substring(0, 15)}...`
            : data.title;
    };

    return (
        <div className="flex w-full items-center space-x-3 hover:bg-green-100 transition-all duration-300 rounded-3xl pl-2 pr-2">
            <div className="text-xs font-bold">{index+1}</div>

            <div
                className={`w-full pt-3 pb-3  flex text-[10px] items-center hover:bg-green-100 transition-all duration-300  justify-between ${getBgColor()} rounded-xl pl-5 pr-5`}
            >
                <div className="flex items-center justify-start space-x-1 w-[70px]">
                    <div
                        className={`w-[7px] h-[7px] flex items-center justify-center rounded-full ${getStatusColor()}`}
                    ></div>
                    <div className="w-[57px]">{data.status}</div>
                </div>
                <div className="w-[95px] text-[0.8rem] font-bold">{cutTitle()}</div>
                <div className="w-[70px] p-2 border-2 border-yellow-500 bg-yellow-200 rounded-full text-center text-yellow-600">
                    {data.type}
                </div>
                <div className="w-[105px] text-gray-500 font-bold break-words flex items-center text-center mr-2">
                    {data.start_date}
                </div>
                <div className="w-[105px] text-gray-500 font-bold break-words flex items-center text-center">
                    {data.end_date}
                </div>
                <div className="font-bold text-[0.7rem]"><span className="text-green-500 font-bold mr-1 text-[0.8rem]">{data.weight}</span>p</div>
            </div>
        </div>
    );
};

export default OneCrossCheck;
