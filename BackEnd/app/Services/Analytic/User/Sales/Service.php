<?php

namespace App\Services\Analytic\User\Sales;

use App\Models\Ticket;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class Service
{
    /**
     * Возвращает статистику продаж по месяцам
     * 
     * @param  int   $range
     * @param  int   $userId
     * @return array
     */
    public function execute(int $range, int $userId): array
    {
        return $this->getAnalyticByMonths($range, $userId);
    }

    /**
     * Возвращает аналитику по нужному периоду
     * 
     * @param  int   $range
     * @param  int   $userId
     * @return array
     */
    protected function getAnalyticByMonths(int $range, int $userId): array
    {
        $result = [];

        for ($range; $range >= 0; $range--) {
            $dates     = $this->generateDates($range);

            $result[] = $this->getAnalyticByMonth(
                $userId,
                $dates['dateStart'],
                $dates['dateEnd'],
                $dates['month']
            );
        }

        return $result;
    }

    /**
     * Формирует даты начала и конца месяца
     * 
     * @param  int   $monthAgo
     * @return array
     */
    protected function generateDates(int $monthAgo): array
    {
        $currentDate = Carbon::now()->startOfMonth();

        $dateStart = $currentDate->copy()
            ->subMonths($monthAgo)
            ->startOfMonth();

        $dateEnd = $currentDate->copy()
            ->subMonths($monthAgo)
            ->endOfMonth();

        return [
            'dateStart' => $dateStart->format('Y-m-d H:i:s'),
            'dateEnd'   => $dateEnd->format('Y-m-d H:i:s'),
            'month'     => $dateEnd->formatLocalized('%B'),
        ];
    }

    /**
     * Высчитывает аналитику нужного месяца
     * 
     * @param  int    $userId
     * @param  string $dateStart
     * @param  string $dateEnd
     * @param  string $month
     * @return array
     */
    protected function getAnalyticByMonth(int $userId, string $dateStart, string $dateEnd, string $month): array
    {
        $salesData = $this->getTicketSalesAndAmount($userId, $dateStart, $dateEnd);
        
        return [
            'month'         => $month,
            'salesSum'      => (int) $salesData['salesSum'],
            'ticketsAmount' => (int) $salesData['ticketsAmount'],
        ];
    }

    /**
     * Возвращает статистику продаж билетов по выбранному промежутку 
     * 
     * @param  int    $userId
     * @param  string $dateStart
     * @param  string $dateEnd
     * @return array
     */
    protected function getTicketSalesAndAmount(int $userId, string $dateStart, string $dateEnd)
    {
        $result = DB::table('events')
            ->select(
                DB::raw('SUM(tickets.price) as sum'),
                DB::raw('COUNT(tickets.id) as ticketsAmount')
            )
            ->join('users', 'users.id', 'events.user_id')
            ->leftJoin('tickets', 'tickets.event_id', 'events.id')
            ->where('users.id', $userId)
            ->where('tickets.status', Ticket::STATUS_ACTIVE)
            ->whereBetween('tickets.created_at',[$dateStart, $dateEnd])
            ->first();

        return [
            'salesSum'      => $result->sum ?? 0,
            'ticketsAmount' => $result->ticketsAmount ?? 0,
        ];
    }
}