<?php

namespace App\Console\Commands;

use App\Models\Answer;
use App\Models\AnswerReview;
use App\Models\Assignment;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use function Sodium\add;

class CreateCrossCheckReviews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:create-cross-check-reviews';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs when cross-check assignment will start to check to the students';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('Cross-check review command started for assignments.');
        $currentDateTime = Carbon::now();

        $assignments = Assignment::whereBetween('end_date', [
            $currentDateTime,
            $currentDateTime->addMinutes(5)
        ])->get();

        foreach ($assignments as $assignment) {
            $user_answer = Answer::select('id', 'user_id')->where('assignment_id', $assignment->id)->orderBy('id', 'desc')->limit(1000)->get()->shuffle();
            $user_ids    = $user_answer->pluck('user_id')->toArray();

            $groups = [];
            $count  = count($user_ids);

            if ( $count <= 5 ){
                $groups = $user_ids;
            } else {
                $index = 0;
                $groups_by_3 = (4 - ($count % 4)) % 4;
                $groups = $this->divide_groups($groups_by_3, $user_ids, $index);
            }

            foreach ($groups as $group) {
                $answer_ids = $user_answer->whereIn('user_id', $group)->pluck('id')->toArray();

                $permutations = $this->generatePermutations($group, $answer_ids);

                $dataToInsert = [];
                foreach ($permutations as $pair) {
                    $dataToInsert[] = [
                        'reviewer_id' => $pair[0],
                        'answer_id'   => $pair[1],
                    ];
                }

                AnswerReview::insertOrIgnore($dataToInsert);
            }
        }
    }

    /**
     * This function divides array of users into groups by 4
     *
     * @param $groups_number
     * @param $array
     * @param $index
     * @return array
     */
    public function divide_groups($groups_number, $array, &$index): array
    {
        $groups = [];
        $count  = count($array);

        for ($group = 0; $group < $groups_number; $group++) {
            if ($index < $count) {
                $groups[] = array_slice($array, $index, 3);
                $index += 3;
            }
        }

        while ($index < $count) {
            $groups[] = array_slice($array, $index, 4);
            $index += 4;
        }

        return $groups;
    }

    /**
     * This function creates all permutations for group users
     *
     * @param $array1
     * @param $array2
     * @return array
     */
    function generatePermutations($array1, $array2) {
        $permutations = [];

        $count1 = count($array1);
        $count2 = count($array2);

        for ($i = 0; $i < $count1; $i++) {
            for ($j = 0; $j < $count2; $j++) {
                if ($i !== $j) {
                    $permutations[] = [$array1[$i], $array2[$j]];
                }
            }
        }

        return $permutations;
    }
}
