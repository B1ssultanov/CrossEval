<?php

namespace App\Console;

use App\Models\Assignment;
use Carbon\Carbon;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Commands for project
     *
     * @var string[]
     */
    protected $commands = [
        \App\Console\Commands\CreateCrossCheckReviews::class,
        \App\Console\Commands\FindMissedAssignments::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->call(function () {
            $assignments = Assignment::where('end_date', '<=', Carbon::now())
                ->where('cross_check_processed', false)
                ->get();

            foreach ($assignments as $assignment) {
                \Artisan::call('app:create-cross-check-reviews');

                $assignment->update(['cross_check_processed' => true]);
            }
        })->everyMinute();

        $schedule->command('app:find-missed-assignments')->everyMinute();
    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
