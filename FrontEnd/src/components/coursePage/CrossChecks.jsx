const CrossChecks = () => {
    const data = [
        {
            status: "Available",
            data: [
                {
                    status: "available",
                    title: "Code Challenge",
                    type: "Code",
                    startDate: "2023-11-08 05:00",
                    endDate: "2023-11-15 05:00",
                    weight: 25,
                    isDone: false,
                },
            ],
        },
        {
            status: "Missed",
            data: [
                {
                    status: "missed",
                    title: "Essay Deadline",
                    type: "Essay",
                    startDate: "2023-10-28 05:00",
                    endDate: "2023-11-04 05:00",
                    weight: 20,
                    isDone: false,
                },
            ],
        },
        {
            status: "Submitted",
            data: [
                {
                    status: "submitted",
                    title: "Quiz 1",
                    type: "Quiz",
                    startDate: "2023-11-02 05:00",
                    endDate: "2023-11-09 05:00",
                    weight: 15,
                    isDone: true,
                },
            ],
        },
        {
            status: "Future",
            data: [
                {
                    status: "future",
                    title: "Group Presentation",
                    type: "Presentation",
                    startDate: "2024-01-10 05:00",
                    endDate: "2024-01-17 05:00",
                    weight: 10,
                    isDone: false,
                },
            ],
        },
        {
            status: "Done",
            data: [
                {
                    status: "done",
                    title: "Final Project",
                    type: "Project",
                    startDate: "2023-12-15 05:00",
                    endDate: "2023-12-22 05:00",
                    weight: 20,
                    isDone: true,
                },
            ],
        },
    ];

    return 
    <div>
        <h1>hello</h1>
    </div>;
};

export default CrossChecks;
