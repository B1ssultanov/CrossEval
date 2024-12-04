<?php

namespace App\Exports;

use App\Models\Assignment;
use App\Models\User;
use App\Models\Answer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class GradesExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    protected $assignmentIds;

    public function __construct($assignmentIds)
    {
        $this->assignmentIds = explode(',', $assignmentIds);
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $assignments = Assignment::whereIn('id', $this->assignmentIds)
            ->with(['answers.user'])
            ->get();

        $assignmentTitles = $assignments->pluck('title')->toArray();

        $studentGrades = [];

        foreach ($assignments as $assignment) {
            foreach ($assignment->answers as $answer) {
                if($answer->user->id == $assignment->course->supervisor_id) continue;
                $studentKey = $answer->user->name . ' ' . $answer->user->surname;

                if (!isset($studentGrades[$studentKey])) {
                    $studentGrades[$studentKey] = [
                        'Name' => $answer->user->name,
                        'Surname' => $answer->user->surname,
                    ];

                    foreach ($assignmentTitles as $title) {
                        $studentGrades[$studentKey][$title] = 'No grade';
                    }
                }

                $studentGrades[$studentKey][$assignment->title] = $answer->grade ?? 'No grade';
            }
        }

        return collect(array_values($studentGrades));
    }

    public function headings(): array
    {
        return array_merge(['Name', 'Surname'], $this->getAssignmentTitles());
    }

    /**
     * This method is for taking the assignment's title
     *
     * @return array
     */
    protected function getAssignmentTitles(): array
    {
        return Assignment::whereIn('id', $this->assignmentIds)->pluck('title')->toArray();
    }

    /**
     * Apply styles to the Excel sheet.
     *
     * @param Worksheet $sheet
     * @return array
     */
    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true]],
        ];
    }
}
