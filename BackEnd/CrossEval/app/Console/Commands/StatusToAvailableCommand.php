<?php

namespace App\Console\Commands;

use App\Models\Answer;
use App\Models\Assignment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class StatusToAvailableCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:status-to-available-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Changes the status of the Answer to the Available, if time has come.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('The Finding started Assignments command started working');

//        $assignments = Assignment::whereBetween('start_date', [Carbon::now()->subHour(), Carbon::now()])->get();

        $assignments = Assignment::where('start_date', '<=', Carbon::now())->get();

        if ($assignments->isNotEmpty()) {
            Log::info('Assignments found: ', $assignments->pluck('id')->toArray());

            $answers = Answer::whereIn('assignment_id', $assignments->pluck('id'))
                ->whereIn('status', 'Future')
                ->get();

            Log::info('Answers to update: ', $answers->pluck('id')->toArray());

            foreach ($answers as $answer) {
                $answer->status = 'Available';
                $answer->save();
            }
        } else {
            Log::info('No assignments found that are started.');
        }
    }
}
