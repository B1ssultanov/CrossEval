<?php

namespace App\Services\Analytic\Sales\SalesByDateRange;

/**
 * Service execution result
 */
class Result
{
    /**
     * Amount of sales for the selected date range
     */
    protected int $salesSum;

    /**
     * Total number of tickets sold
     */
    protected int $ticketsAmount;

    public function __construct(int $salesSum, int $ticketsAmount)
    {
        $this->salesSum      = $salesSum;
        $this->ticketsAmount = $ticketsAmount;
    }


    /**
     * Returns the amount of sales
     * 
     * @return int
     */
    public function getSalesSum(): int
    {
        return $this->salesSum;
    }

    /**
     * Returns the total number of tickets sold
     * 
     * @return int
     */
    public function getTicketsAmount(): int
    {
        return $this->ticketsAmount;
    }
}