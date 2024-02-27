<?php

namespace App\Services\Analytic\Sales\SalesByWeeks;

use App\Services\Analytic\Sales\SalesByDateRange\Service as SalesByDateRangeService;
use Carbon\Carbon;

class Service
{
    /**
     * Return sales data by week
     *
     * @param  int   $lastWeeks
     * @return array
     */
    public function execute(int $lastWeeks): array
    {
        $currentDate  = Carbon::now();
        $weeklySales  = [];
        $salesService = new SalesByDateRangeService;

        for ($lastWeeks; 0 <= $lastWeeks; $lastWeeks--) {
            $date      = $currentDate->copy()->subWeeks($lastWeeks);
            $startDate = $date->copy()->startOfWeek();
            $endDate   = $date->copy()->endOfWeek();

            // Получение статистики продаж за текущую неделю
            $sales = $salesService->execute($startDate, $endDate);

            // Создание записи для недели и интервала даты
            $weeklySales[] = [
                'date'          => $startDate->format('m-d') . ' / ' . $endDate->format('m-d'),
                'salesSum'      => $sales->getSalesSum(),
                'ticketsAmount' => $sales->getTicketsAmount(),
            ];
        }

        return $weeklySales;
    }
}
