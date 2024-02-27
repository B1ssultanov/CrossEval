<?php

namespace App\Http\Controllers\Admin;

use App\Models\Event;
use App\Models\Organization;
use App\Models\User;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\User\ShowRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\View\View;

class UserController extends Controller
{
    /**
     * 
     * @param  \App\Http\Requests\Admin\User\ShowRequest $request
     * @param  int                                       $int
     * @return \Illuminate\View\View
     */
    public function show(ShowRequest $request, int $id): View
    {
        $user = User::where('id', $id)->first();

        return view('users.show', [
            'user'          => $user,
            'organizations' => $user->organizations,
            'events'        => $user->events()->where('status', Event::STATUS_LIVE)->get(),
            'salesData'     => $user->getTicketSales(),
        ]);
    }

    /**
     * Страница со списком пользователей
     *
     * @param Request $request
     */
    public function get(Request $request)
    {
        $limit  = 10;
        $page   = $request->page ?? 1;
        $offset = ($page - 1) * $limit;

        $users = User::where('id', '>', 0);

        if (isset($request->status)) {
            $users = $users->where('status', $request->status);
        }

        if (isset($request->search)) {
            $users->where('email','LIKE', "%{$request->search}%");
        }

        $users = $users->orderBy($request->orderByCol ?? 'id', $request->orderBySort ?? 'asc' );
        $users = $users->select(DB::raw('users.*'),
                                DB::raw('(SELECT COUNT(*)
                                               FROM    organizations
                                               WHERE   organizations.user_id = users.id
                                               )
                                               AS organizations_count'
                                        )
                                );
        $users = $users->get();


        $nbTotal   = $users->count();
        $totalPage = ceil($nbTotal / $limit);

        return view('users.index', [
            'users'     => $users->skip($offset)->take($limit),
            'page'      => $page,
            'nbTotal'   => $users->count(),
            'totalPage' => $totalPage,
            'search'    => $request->search ?? ''
        ]);
    }

    /**
     * Отправить пользователя в бан
     *
     * @param Request $request
     */
    public function userToBan(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();
        $user->status = 'ban';
        $user->save();

        return redirect()->back();
    }

    /**
     * Разбанить пользователя
     *
     * @param Request $request
     */
    public function userUnban(Request $request)
    {
        $user = User::where('id', $request->user_id)->first();
        $user->status = 'active';
        $user->save();

        return redirect()->back();
    }
}
