<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">
    <link rel="stylesheet" href="{{asset('fonts.css')}}">
    <!-- Scripts -->
    @vite(['resources/sass/app.scss', 'resources/ts/main.tsx'])
</head>
<body>
<div id="app">
    @guest

    @else

        <nav  class="navbar navbar-expand-md navbar-light ">
            <div class="container col-8 m-auto">
                <a class="navbar-brand" href="{{ url('/home') }}" onclick="route()">
                    outono
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent" style="display: none">
                    <!-- Left Side Of Navbar -->


                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ms-auto">
                        <!-- Authentication Links -->
                        @guest

                        @else
                            <li class="nav-item">
                                <a  class="nav-link">
                                    <span id="clock"></span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link">
                                    &verbar;
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#">
                                    <span id="user-name"><i class="fa fa-user-alt"></i>&nbsp;{{ Auth::user()->name }}</span>
                                </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="{{ route('logout') }}"
                                   onclick="event.preventDefault();
                                   document.getElementById('logout-form').submit();">
                                    <i class="fa fa-sign-out-alt"></i>&nbsp;{{ __('Sair') }}
                                </a>

                                <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                    @csrf
                                </form>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>
    @endguest

        <main class="py-4">
            @yield('content')

        </main>
</div>
</body>
</html>
