<?php

namespace App\Services\Analytic\Sales\SalesByDateRange;

use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Service
{
    /**
     * Returns sales data for the selected period
     * 
     * @param  string|null                                          $dateStart
     * @param  string|null                                          $dateEnd
     * @return \App\Services\Analytic\Sales\SalesByDateRange\Result
     */
    public function execute(?string $dateStart = null, ?string $dateEnd = null): Result
    {
        $tickets = DB::table('tickets')
            ->select(
                DB::raw('SUM(tickets.price) as sum'),
                DB::raw('COUNT(tickets.id) as ticketsAmount')
            )
            ->where('tickets.status', Ticket::STATUS_ACTIVE);

        if ($dateStart) {
            $tickets = $tickets->where('created_at', '>=', $dateStart);
        }

        if ($dateEnd) {
            $tickets = $tickets->where('created_at', '<=', $dateEnd);
        }

        $ticketResult = $tickets->first();

        return new Result($ticketResult->sum ?? 0, $ticketResult->ticketsAmount ?? 0);
    }
}