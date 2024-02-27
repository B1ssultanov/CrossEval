<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use App\Models\Event;
use App\Services\Analytic\Sales\SalesByDateRange\Service as SalesByDateRangeService;
use App\Services\Event\SearchEvent\Service as SearchEventService;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $currentDay   = Carbon::now()->startOfDay();
        $salesService = new SalesByDateRangeService;
        $salesData    = $salesService->execute();
        $daySales     = $salesService->execute($currentDay->format('Y-m-d H:i:s'));
        $users        = User::where('status', 'active')->get();
        $events       = (new SearchEventService)->execute([
            'status' => 'live'
        ], 1);

        return view('welcome' , [
            'users'     => $users,
            'events'    => $events,
            'salesData' => $salesData,
            'daySales'  => $daySales,
        ]);
    }

    /**
     * Return guest page
     *
     * @return false|int
     */
    public function mainPage()
    {
        return file_get_contents('C:\Users\yedyg\Documents\GitHub\CrossEval\BackEnd\public\test_main.html');
    }
}
