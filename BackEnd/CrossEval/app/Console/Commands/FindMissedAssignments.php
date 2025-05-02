<?php

namespace App\Console\Commands;

use App\Models\Answer;
use App\Models\Assignment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class FindMissedAssignments extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:find-missed-assignments';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs every minute to check if the assignment time is ended, to change the status for students who dont submitted answer';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('The Finding missed Assignments command started working');

        $assignments = Assignment::where('end_date', '<=', Carbon::now())->get();

        if ($assignments->isNotEmpty()) {
            Log::info('Assignments found: ', $assignments->pluck('id')->toArray());

            $answers = Answer::whereIn('assignment_id', $assignments->pluck('id'))
                ->whereIn('status', ['Available', 'Future'])
                ->get();

            Log::info('Answers to update: ', $answers->pluck('id')->toArray());

            foreach ($answers as $answer) {
                $answer->status = 'Missed';
                $answer->save();
            }
        } else {
            Log::info('No assignments found that are past due.');
        }
    }
}
