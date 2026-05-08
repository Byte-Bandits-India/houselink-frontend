@extends('website.layouts.app')
@section('head')
    <style>
        .card {
            box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.05), 0 5px 15px 0 rgba(0, 0, 0, 0.05);
            --bs-card-border-color: rgb(0 0 0 / 6%);
        }
        .dashicons{
            widows: 80px;
            height: 80px;
        }
        .icontitle{
            color: #163d75;
        }
        .btn-outline-primary {
            --bs-btn-color: #163d75;
            --bs-btn-border-color: #163d75a1;
            --bs-btn-hover-color: #fff;
            --bs-btn-hover-bg: #163d75;
            --bs-btn-hover-border-color: #163d75;
            --bs-btn-focus-shadow-rgb: 13, 110, 253;
            --bs-btn-active-color: #fff;
            --bs-btn-active-bg: #163d75;
            --bs-btn-active-border-color: #163d75;
            --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
            --bs-btn-disabled-color: #163d75;
            --bs-btn-disabled-bg: transparent;
            --bs-btn-disabled-border-color: #163d75;
            --bs-gradient: none;
        }
    </style>
    <div class="page-header parallaxie">
        <div class="container">
            <div class="row">
                <div class="col-lg-12">
                    <div class="page-header-box">
                        <h1 class="text-anime-style-2" data-cursor="-opaque">Customer Dashboard</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ route('index') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Customer-Dashboard</li>
                            </ol>
                        </nav>
                    </div>
                </div>
            </div> 
        </div>
    </div>
@endsection
@section('styles')
    <style>
        .customer-submenu {
            list-style: none;
            padding-left: 0;
            margin: 0;
        }
        .customer-submenu .nav-item {
            padding: 0.3rem 1rem;
        }
        .customer-submenu .nav-link i {
            margin-right: 8px;
        }

        .page-header {
            background: url("{{ asset('assets/images/footer/dashboard_image.png')}}");
        }
  
        .sidebar {
            min-height: 100vh;
            border-right: 1px solid #ddd;
            background-color: #fff;
        }
        .dashboard_meanu.active {
            color: #163d75 !important;
            font-weight: bold;
            background: #e2ecfc;
            border-radius: 6px;
        }
        .nav-link {
            color: #24487d;
        }
        .header__right a {
            color: #000;
            margin-left: 10px;
        }
        .header__right a:hover {
            color: #007bff;
        }
        @media (max-width: 767.98px) {
            .sidebar {
                border-right: none;
                border-bottom: 1px solid #ddd;
                margin-bottom: 1rem;
                padding-bottom: 1rem;
            }
        }    
        .badge-danger{
            background: green;
            color: white;
        }
        
        .rent-card {
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }
        .active-badge {
            z-index: 10;
        }
    </style>
@endsection
@section('content')
<section class="login-page-wrapper py-4 mt-5">
    <div class="container py-2">
        <div class="row justify-content-center">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-12 d-md-none mb-3">
                        <button class="btn btn-outline-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#dashboardSidebar" aria-expanded="false" aria-controls="dashboardSidebar">
                            <i class="fas fa-bars"></i> Menu
                        </button>
                    </div>
                    @include('website.layouts.sidebar')
                    <div class="col-md-10 col-12 py-4" id="dashboard-content">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-12">
                                    <div class="d-flex justify-content-between align-items-center mb-4">
                                        <h2 style="color: #163d75">Dashboard</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex gap-2 mb-3">
                            <button type="button" 
                                    class="btn btn-filter-package active" 
                                    data-filter="buy"
                                    style="background-color: #163d75; color: white; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px; transition: all 0.3s ease;">
                                Sell
                            </button>
                            <button type="button" 
                                    class="btn btn-filter-package" 
                                    data-filter="rent"
                                    style="background-color: white; color: #163d75; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px; transition: all 0.3s ease;">
                                Rent/Lease
                            </button>
                        </div>
                        <div id="buy-section">
                            <div class="container">
                                <div class="row d-flex align-items-stretch">
<div class="col-md-4">
    <div class="card h-100">
        <div class="card-body d-flex flex-column">
            <div class="row">
                <div class="col-12">
                    <center><img class="dashicons" src="{{ asset('icons/accountant.png') }}" alt="Icon" /></center>
                </div>
                <div class="col-12"></div>
            </div>
            <h4 class="icontitle text-center">Owner Credit Points</h4>

            @php
                $totalOwnerCredits = \App\Models\CustomerPurchasedPackage::where('customer_id', $customerId ?? session('customer_id') ?? auth()->id())
                    ->where('user_type', 'Owner')  // ← Capital 'O' important
                    ->where('expire_on', '>=', now())
                    ->where('no_of_credit', '>', 0)
                    ->where('status', '!=', 'unassigned')
                    ->sum('no_of_credit');

                $latestOwnerPackage = \App\Models\CustomerPurchasedPackage::where('customer_id', $customerId ?? session('customer_id') ?? auth()->id())
                    ->where('user_type', 'Owner')
                    ->where('expire_on', '>=', now())
                    ->where('no_of_credit', '>', 0)
                    ->latest('created_at')
                    ->first();
            @endphp

            @if($totalOwnerCredits > 0)
                <center><h1><strong>{{ $totalOwnerCredits }}</strong></h1></center>
                @if($latestOwnerPackage)
                    <center><p class="mt-2">Expiry-Date: {{ \Carbon\Carbon::parse($latestOwnerPackage->expire_on)->format('d-m-Y') }}</p></center>
                @endif
              
            @else
                <center><h5 style="margin-top: 10px; margin-bottom: 10px;"><strong>No package found</strong></h5></center>
            @endif

            <center class="mt-auto">
                @if($totalOwnerCredits > 0)
                    <button class="btn btn-success w-100 fw-semibold" disabled>Active</button>
                @else
                    <a type="button" class="btn btn-outline-primary mt-2"
                       href="{{ route('dashboard.section', ['type' => 'credits', 'tab' => 'owner']) }}">
                        Buy Package
                    </a>
                @endif
            </center>
        </div>
    </div>
</div>
<div class="col-md-4">
    <div class="card h-100">
        <div class="card-body d-flex flex-column">
            <div class="row">
                <div class="col-12">
                    <center><img class="dashicons" src="{{ asset('icons/house-builder.png') }}" alt="Icon" /></center>
                </div>
                <div class="col-12"></div>
            </div>
            <h4 class="icontitle text-center">Builder Credit Points</h4>

            @php
                $totalBuilderCredits = \App\Models\CustomerPurchasedPackage::where('customer_id', $customerId ?? session('customer_id') ?? auth()->id())
                    ->where('user_type', 'Builder')  // ← capital 'B'
                    ->where('expire_on', '>=', now())
                    ->where('no_of_credit', '>', 0)
                    ->where('status', '!=', 'unassigned')
                    ->sum('no_of_credit');

                $latestBuilderPackage = \App\Models\CustomerPurchasedPackage::where('customer_id', $customerId ?? session('customer_id') ?? auth()->id())
                    ->where('user_type', 'Builder')
                    ->where('expire_on', '>=', now())
                    ->where('no_of_credit', '>', 0)
                    ->latest('created_at')
                    ->first();
            @endphp

            @if($totalBuilderCredits > 0)
                <center><h1><strong>{{ $totalBuilderCredits }}</strong></h1></center>
                @if($latestBuilderPackage)
                    <center><p class="mt-2">Expiry-Date: {{ \Carbon\Carbon::parse($latestBuilderPackage->expire_on)->format('d-m-Y') }}</p></center>
                @endif
            @else
                <center><h5 style="margin-top: 10px; margin-bottom: 10px;"><strong>No package found</strong></h5></center>
            @endif

            <center class="mt-auto">
                @if($totalBuilderCredits > 0)
                    <button class="btn btn-success w-100 fw-semibold" disabled>Active</button>
                @else
                    <a type="button" class="btn btn-outline-primary mt-2"
                       href="{{ route('dashboard.section', ['type' => 'credits', 'tab' => 'builder']) }}">
                        Buy Package
                    </a>
                @endif
            </center>
        </div>
    </div>
</div>

<div class="col-md-4">
    <div class="card h-100">
        <div class="card-body d-flex flex-column">
            <div class="row">
                <div class="col-12">
                    <center><img class="dashicons" src="{{ asset('icons/consultation (1).png') }}" alt="Icon" /></center>
                </div>
                <div class="col-12"></div>
            </div>
            <h4 class="icontitle text-center">Consultant Credit Points</h4>

            @php
                $totalConsultantCredits = \App\Models\CustomerPurchasedPackage::where('customer_id', $customerId ?? session('customer_id') ?? auth()->id())
                    ->where('user_type', 'Consultant') 
                    ->where('expire_on', '>=', now())
                    ->where('no_of_credit', '>', 0)
                    ->where('status', '!=', 'unassigned')
                    ->sum('no_of_credit');

                $latestConsultantPackage = \App\Models\CustomerPurchasedPackage::where('customer_id', $customerId ?? session('customer_id') ?? auth()->id())
                    ->where('user_type', 'Consultant')
                    ->where('expire_on', '>=', now())
                    ->where('no_of_credit', '>', 0)
                    ->latest('created_at')
                    ->first();
            @endphp

            @if($totalConsultantCredits > 0)
                <center><h1><strong>{{ $totalConsultantCredits }}</strong></h1></center>
                
                @if($latestConsultantPackage)
                    <center><p class="mt-2">Expiry-Date: {{ \Carbon\Carbon::parse($latestConsultantPackage->expire_on)->format('d-m-Y') }}</p></center>
                @endif
                
                @if($totalConsultantCredits <= 10)
                @endif
            @else
                <center><h5 style="margin-top: 10px; margin-bottom: 10px;"><strong>No package found</strong></h5></center>
            @endif

            <center class="mt-auto">
                @if($totalConsultantCredits > 0)
                    <button class="btn btn-success w-100 fw-semibold" disabled>Active</button>
                @else
                    <a type="button" class="btn btn-outline-primary mt-2"
                       href="{{ route('dashboard.section', ['type' => 'credits', 'tab' => 'consultant']) }}">
                        Buy Package
                    </a>
                @endif
            </center>
        </div>
    </div>
</div>
                                </div>
                            </div>
                        </div>
                       <div id="rent-section" style="display: none;">
    <div class="container">
        <div class="row d-flex align-items-stretch">
            <div class="col-md-4">
                <div class="card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="row">
                            <div class="col-12">
                                <center><img class="dashicons" src="{{ asset('icons/accountant.png') }}" alt="Icon" /></center>
                            </div>
                        </div>
                        <h4 class="icontitle text-center">Enquiry Credit Points</h4>

                        @if($hasRentPlan)
                            <center><h1><strong>{{ $remainingPoints }}</strong></h1></center>
                            @if($rentPlanExpiry)
                                <center><p class="mt-2">Expiry-Date: {{ \Carbon\Carbon::parse($rentPlanExpiry)->format('d-m-Y') }}</p></center>
                            @endif
                        @else
                            <center><h5 style="margin-top: 10px; margin-bottom: 10px;"><strong>No package found</strong></h5></center>
                        @endif

                        <center class="mt-auto">
                            @if($hasRentPlan)
                                <button class="btn btn-success w-100 fw-semibold" disabled>Active</button>
                            @else
                                <a type="button" class="btn btn-outline-primary mt-2"
                                   href="{{ route('dashboard.section', ['type' => 'credits']) }}?filter=rent">
                                    Buy Package
                                </a>
                            @endif
                        </center>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
@endsection

@section('scripts')
<script>
$(document).ready(function () {
    function loadDashboardSection(url) {
        $('#dashboard-content').html('<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i></div>');
        $.get(url, function (data) {
            $('#dashboard-content').html(data);
        });
    }
    
    let defaultUrl = $('.dashboard-link.active').data('url');
    if (defaultUrl) {
        loadDashboardSection(defaultUrl);
    }
    
    $('.dashboard-link').on('click', function (e) {
        e.preventDefault();
        $('.dashboard-link').removeClass('active');
        $(this).addClass('active');
        let url = $(this).data('url');
        loadDashboardSection(url);
        
        if ($(window).width() < 768) {
            $('#dashboardSidebar').collapse('hide');
        }
    });
    
    let hash = window.location.hash.substring(1);
    if (hash) {
        let targetLink = $('.dashboard-link[data-url*="' + hash + '"]');
        if (targetLink.length) {
            targetLink.trigger('click');
        }
    }
});

$(document).on('click', '#loadSection', function (e) {
    e.preventDefault();
    var url = $(this).data('url');
    $.ajax({
        url: url,
        type: 'GET',
        beforeSend: function () {
            $('#dashboard-content').html('<div class="text-center my-4"><i class="fa fa-spinner fa-spin"></i> Loading...</div>');
        },
        success: function (response) {
            $('#dashboard-content').html(response);
        },
        error: function () {
            $('#dashboard-content').html('<div class="alert alert-danger">Failed to load content.</div>');
        }
    });
});

$(document).on('click', '.pagination a', function (e) {
    e.preventDefault();
    let url = $(this).attr('href');
    if (!url) return;
    $('#dashboard-content').html('<div class="text-center my-4"><i class="fa fa-spinner fa-spin"></i> Loading...</div>');
    $.get(url, function (response) {
        $('#dashboard-content').html(response);
    }).fail(function () {
        $('#dashboard-content').html('<div class="alert alert-danger">Failed to load content.</div>');
    });
});

$('.btn-filter-package').on('click', function() {
    const filter = $(this).data('filter');
    $('.btn-filter-package').css({
        'background-color': 'white',
        'color': '#163d75'
    }).removeClass('active');
    
    $(this).css({
        'background-color': '#163d75',
        'color': 'white'
    }).addClass('active');
    
    if (filter === 'buy') {
        $('#buy-section').show();
        $('#rent-section').hide();
    } else {
        $('#buy-section').hide();
        $('#rent-section').show();
    }
});
</script>

<script src="https://kit.fontawesome.com/a076d05399.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function () {
        document.querySelectorAll('.customer-menu-toggle').forEach(function (toggle) {
            toggle.addEventListener('click', function (e) {
                e.preventDefault();
                const submenu = this.nextElementSibling;
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
            });
        });
    });
</script>
@endsection