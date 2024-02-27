<?php

namespace App\Http\Middleware;

use App\Enum\Platform\Platform;
use Closure;
use Illuminate\Http\Request;

/**
 * Parses and extracts data from the headers and places them in the request body.
 */
class HeaderParsingMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $request->merge([
            'version'  => $request->header('version') ?? 1.0,
            'platform' => $request->header('platform') ?? Platform::PLATFORM_DEFAULT,
        ]);

        return $next($request);
    }
}
