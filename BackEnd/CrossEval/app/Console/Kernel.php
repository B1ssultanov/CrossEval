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
        \App\Console\Commands\StatusToAvailableCommand::class,
    ];

    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('app:create-cross-check-reviews')->everyMinute();

        $schedule->command('app:find-missed-assignments')->everyMinute();

        $schedule->command('app:status-to-available-command')->everyMinute();
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
