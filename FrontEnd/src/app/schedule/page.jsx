import ScheduleTable from "@/components/ant-design/ScheduleTable";

export default function Schedule(){
    return (
        <div>
            This is Schedule page
            <div className="w-[100%] flex flex-col items-center mt-10 ">
                <ScheduleTable  />
            </div>
        </div>
    )
}