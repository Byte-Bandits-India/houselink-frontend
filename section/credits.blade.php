@extends('website.layouts.app')
@section('head')
    <style>
        @media (max-width: 768px) {
        .flag-tag {
            font-size: 12px;
            padding: 4px 8px;
        }

        .project-item-box {
            margin-bottom: 1.5rem;
        }

        .project-featured-image {
            height: auto;
        }

        .image-customer img {
            width: 100%;
            height: auto;
        }

        .top-customer-image i.fa-heart {
            align-self: flex-end;
            margin-top: 5px;
        }
        }
        .listingimg{
            width: 300px;
            height: -webkit-fill-available;
        }
            .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
            color: #ffffff;
            background-color: #163d75;
            border-color: var(--bs-nav-tabs-link-active-border-color);
        }
            .card {
                box-shadow: var(--bs-box-shadow-lg) !important;
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
                    <!-- Page Header Box Start -->
                    <div class="page-header-box">
                        <h1 class="text-anime-style-2" data-cursor="-opaque">Customer Dashboard</h1>
                        <nav class="wow fadeInUp">
                            <ol class="breadcrumb">
                                <li class="breadcrumb-item"><a href="{{ route('index') }}">Home</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Customer-Dashboard</li>
                            </ol>
                        </nav>
                    </div>
                    <!-- Page Header Box End -->
                </div>
            </div> 
        </div>
    </div>
@endsection
@section('styles')
    <style>
        .page-header {
            background: url("{{ asset('assets/images/footer/dashboard_image.png')}}");
        }
    </style>
    <style>
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
    </style>
@endsection
@section('content')
<section class="login-page-wrapper py-4 mt-5">
    <div class="container py-2">
        <div class="row justify-content-center">
            <div class="container-fluid">
                <div class="row">
                    <!-- Mobile Toggle Button -->
                    <div class="col-12 d-md-none mb-3">
                        <button class="btn btn-outline-primary w-100" type="button" data-bs-toggle="collapse" data-bs-target="#dashboardSidebar" aria-expanded="false" aria-controls="dashboardSidebar">
                            <i class="fas fa-bars"></i> Menu
                        </button>
                    </div>
                     @include('website.layouts.sidebar')
                    <!-- Main Content -->
                    <div class="col-md-10 col-12 py-4" id="dashboard-content">
                        
                        <div class="container">
    <div class="row">
        <div class="col-md-10">
            <div class="d-flex justify-content-between align-items-center">
                <h2>Buy Packages</h2>
            </div>
        </div>
    </div>
</div>
<div class="container py-4">
    <div class="col-12 pb-4 d-flex">
        <div class="d-flex gap-2 mb-3 justify-content-center">
            <button type="button"
                    class="btn btn-filter-credit active"
                    data-filter="sell"
                    style="background-color: #163d75; color: white; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px; transition: all 0.3s ease;">
                Sell
            </button>
            <button type="button"
                    class="btn btn-filter-credit"
                    data-filter="rent"
                    style="background-color: white; color: #163d75; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px; transition: all 0.3s ease;">
                Rent/Lease
            </button>
        </div>
    </div>
    @php $activeTab = request('tab', 'owner'); @endphp
<div id="sell-credit-section">
    <div class="col-12 pb-2">
        <ul class="nav nav-tabs w-100 border" id="packageTab" role="tablist">
            <li class="nav-item flex-fill text-center">
                <a class="nav-link tab-link border-end {{ ($activeTab ?? '') === 'owner' ? 'active' : '' }}" data-bs-toggle="tab" data-bs-target="#owner" type="button">Owners</a>
            </li>
            <li class="nav-item flex-fill text-center">
                <a class="nav-link tab-link border-end {{ ($activeTab ?? '') === 'builder' ? 'active' : '' }}" data-bs-toggle="tab" data-bs-target="#builder" type="button">Builders</a>
            </li>
            <li class="nav-item flex-fill text-center">
                <a class="nav-link tab-link border-end {{ ($activeTab ?? '') === 'consultant' ? 'active' : '' }}" data-bs-toggle="tab" data-bs-target="#consultant" type="button">Consultants</a>
            </li>
        </ul>
    </div>
    <div class="tab-content mt-4" id="packageTabContent">
        {{-- OWNER TAB --}}
        <div class="tab-pane fade {{ ($activeTab ?? '') === 'owner' ? 'show active' : '' }}" id="owner">
            <div class="row">
                @forelse ($owners as $owner)
                    @php
                        $packageStatus = $PurchasedPackages[$owner->id] ?? null;
                        $no_of_credit = $packageStatus->no_of_credit ?? null;
                        $expire_on = optional($packageStatus)->expire_on;
                        $expiry_iso = $expire_on ? \Carbon\Carbon::parse($expire_on)->toIso8601String() : null;
                        $isActive = $packageStatus && ($no_of_credit > 0) && (!$expire_on || \Carbon\Carbon::parse($expire_on)->isFuture());
                    @endphp
                   <div class="col-md-4 mt-4">
                    <div class="card h-100 d-flex flex-column border-0 shadow-sm text-center p-3 rounded-4 position-relative">

                        @if ($owner->percent_save > 0)
                            <div class="position-absolute top-0 end-0 bg-success text-white px-2 py-1 small rounded-start">
                                SAVE {{ $owner->percent_save }}%
                            </div>
                        @endif

                        <center>
                            <img class="dashicons" src="{{ asset('icons/award.png') }}" alt="Icon" />
                        </center>

                        <div class="fw-bold fs-4 mt-3">
                            ₹{{ number_format($owner->price) }}
                            <span class="text-muted small">/ {{ $owner->no_of_credit }} post</span>
                        </div>

                        <div class="fs-5 mt-2 fw-semibold">{{ $owner->name }}</div>
                        <div class="text-muted small">{{ $owner->description ?? 'Owner Package' }}</div>
                        <div class="text-muted small">{{ $owner->total_month_limit }} Days validity</div>

                        {{-- Pushable content --}}
                        <div class="flex-grow-1">
                            <ul class="list-unstyled my-4 text-start px-4">
                                @if($owner->features && $owner->features->count())
                                    @foreach($owner->features as $feature)
                                        <li><i class="fas fa-check-circle text-primary me-2"></i> {{ $feature->title }}</li>
                                    @endforeach
                                @endif
                            </ul>
                        </div>

                        {{-- Button at bottom --}}
                        <div>
                            @if($isActive)
                                <button class="btn btn-success w-100 fw-semibold" disabled>
                                    Active
                                </button>
                            @elseif($hasAnyOwnerActivePackage)
                                <button class="btn btn-secondary w-100 fw-semibold show-purchase-alert">
                                    Buy Package
                                </button>
                            @else
                                <button class="btn btn-outline-primary w-100 fw-semibold buy-package-btn"
                                    data-id="{{ $owner->id }}"
                                    data-price="{{ $owner->price }}"
                                    data-credits="{{ $no_of_credit }}"
                                    data-expiry="{{ $expiry_iso }}">
                                    Buy Package
                                </button>
                            @endif
                        </div>
                    </div>
                </div>

@empty
                    <div class="col-12 text-center py-5">
                        <h5 class="text-muted">No Buy packages available at the moment.</h5>
                    </div>
                @endforelse
            </div>
        </div>
        {{-- BUILDER TAB --}}
        <div class="tab-pane fade {{ ($activeTab ?? '') === 'builder' ? 'show active' : '' }}" id="builder">
            <div class="row">
                @forelse ($builders as $builder)
                    @php
                        $packageStatus = $PurchasedPackages[$builder->id] ?? null;
                        $no_of_credit = $packageStatus->no_of_credit ?? null;
                        $expire_on = optional($packageStatus)->expire_on;
                        $expiry_iso = $expire_on ? \Carbon\Carbon::parse($expire_on)->toIso8601String() : null;
                        $isActive = $packageStatus && ($no_of_credit > 0) && (!$expire_on || \Carbon\Carbon::parse($expire_on)->isFuture());
                    @endphp
                   <div class="col-md-4 mt-4">
                        <div class="card h-100 d-flex flex-column border-0 shadow-sm text-center p-3 rounded-4 position-relative">
                            
                            @if ($builder->percent_save > 0)
                                <div class="position-absolute top-0 end-0 bg-success text-white px-2 py-1 small rounded-start">
                                    SAVE {{ $builder->percent_save }}%
                                </div>
                            @endif

                            <center>
                                <img class="dashicons" src="{{ asset('icons/award.png') }}" alt="Icon" />
                            </center>

                            <div class="fw-bold fs-4 mt-3">
                                ₹{{ number_format($builder->price) }}
                                <span class="text-muted small">/ {{ $builder->no_of_credit }} post</span>
                            </div>

                            <div class="fs-5 mt-2 fw-semibold">{{ $builder->name }}</div>
                            <div class="text-muted small">{{ $builder->description ?? 'Builder Package' }}</div>
                            <div class="text-muted small">{{ $builder->total_month_limit }} Days validity</div>

                            {{-- Growable space --}}
                            <div class="flex-grow-1">
                                <ul class="list-unstyled my-4 text-start px-4">
                                    @if($builder->features && $builder->features->count())
                                        @foreach($builder->features as $feature)
                                            <li>
                                                <i class="fas fa-check-circle text-primary me-2"></i> {{ $feature->title }}
                                            </li>
                                        @endforeach
                                    @endif
                                </ul>
                            </div>

                            {{-- Button at bottom --}}
                            <div>
                                @if($isActive)
                                    <button class="btn btn-success w-100 fw-semibold" disabled>
                                        Active
                                    </button>
                                @elseif($hasAnyBuilderActivePackage)
                                    <button class="btn btn-secondary w-100 fw-semibold show-purchase-alert">
                                        Buy Package
                                    </button>
                                @else
                                    <button class="btn btn-outline-primary w-100 fw-semibold buy-package-btn"
                                        data-id="{{ $builder->id }}"
                                        data-price="{{ $builder->price }}"
                                        data-credits="{{ $no_of_credit }}"
                                        data-expiry="{{ $expiry_iso }}">
                                        Buy Package
                                    </button>
                                @endif
                            </div>
                            
                        </div>
                    </div>

                @empty
                    <div class="col-12 text-center py-5">
                        <h5 class="text-muted">No Buy packages available at the moment.</h5>
                    </div>
                @endforelse
            </div>
        </div>
        {{-- CONSULTANT TAB --}}
        <div class="tab-pane fade {{ ($activeTab ?? '') === 'consultant' ? 'show active' : '' }}" id="consultant">
            <div class="row">
                @forelse ($consultants as $consultant)
                    @php
                        $packageStatus = $PurchasedPackages[$consultant->id] ?? null;
                        $no_of_credit = $packageStatus->no_of_credit ?? null;
                        $expire_on = optional($packageStatus)->expire_on;
                        $expiry_iso = $expire_on ? \Carbon\Carbon::parse($expire_on)->toIso8601String() : null;
                        $isActive = $packageStatus && ($no_of_credit > 0) && (!$expire_on || \Carbon\Carbon::parse($expire_on)->isFuture());
                    @endphp
                     <div class="col-md-4 mt-4">
                   <div class="card h-100 d-flex flex-column border-0 shadow-sm text-center p-3 rounded-4 position-relative">
    
                        @if ($consultant->percent_save > 0)
                            <div class="position-absolute top-0 end-0 bg-success text-white px-2 py-1 small rounded-start">
                                SAVE {{ $consultant->percent_save }}%
                            </div>
                        @endif

                        <center>
                            <img class="dashicons" src="{{ asset('icons/award.png') }}" alt="Icon" />
                        </center>

                        <div class="fw-bold fs-4 mt-3">
                            ₹{{ number_format($consultant->price) }}
                            <span class="text-muted small">/ {{ $consultant->no_of_credit }} post</span>
                        </div>
                        <div class="fs-5 mt-2 fw-semibold">{{ $consultant->name }}</div>
                        <div class="text-muted small">{{ $consultant->description ?? 'Consultant Package' }}</div>
                        <div class="text-muted small">{{ $consultant->total_month_limit }} Days validity</div>

                        {{-- Growable content --}}
                        <div class="flex-grow-1">
                            <ul class="list-unstyled my-4 text-start px-4">
                                @if($consultant->features && $consultant->features->count())
                                    @foreach($consultant->features as $feature)
                                        <li><i class="fas fa-check-circle text-primary me-2"></i> {{ $feature->title }}</li>
                                    @endforeach
                                @endif
                            </ul>
                        </div>

                        {{-- Bottom Button --}}
                        <div>
                            @if($isActive)
                                <button class="btn btn-success w-100 fw-semibold" disabled>
                                    Active
                                </button>
                            @elseif($hasAnyConsultantActivePackage)
                                <button class="btn btn-secondary w-100 fw-semibold show-purchase-alert">
                                    Buy Package
                                </button>
                            @else
                                <button class="btn btn-outline-primary w-100 fw-semibold buy-package-btn"
                                    data-id="{{ $consultant->id }}"
                                    data-price="{{ $consultant->price }}"
                                    data-credits="{{ $no_of_credit }}"
                                    data-expiry="{{ $expiry_iso }}">
                                    Buy Package
                                </button>
                            @endif
                        </div>
                    </div>
                </div>
                @empty
                    <div class="col-12 text-center py-5">
                        <h5 class="text-muted">No Buy packages available at the moment.</h5>
                    </div>
                @endforelse
            </div>
        </div>
</div>
    </div>
    <div id="rent-credit-section" style="display: none;">
        <div class="row">
            @forelse($rentPlans as $plan)
                @php
                    $isRentActive = $hasRentPlan && ($rentPlanName == $plan->plan_name);
                    $displayPrice = $plan->final_price > 0 ? $plan->final_price : $plan->price;
                @endphp
                <div class="col-md-4 mt-4">
                    <div class="card h-100 d-flex flex-column border-0 shadow-sm text-center p-3 rounded-4 position-relative">

                        @if (!empty($plan->percent_save) && $plan->percent_save > 0)
                            <div class="position-absolute top-0 end-0 bg-success text-white px-2 py-1 small rounded-start">
                                SAVE {{ number_format($plan->percent_save, 2) }}%
                            </div>
                        @endif

                        <center>
                            <img class="dashicons" src="{{ asset('icons/award.png') }}" alt="{{ $plan->plan_name }}" />
                        </center>

                        <div class="fw-bold fs-4 mt-3">
                            ₹{{ number_format($displayPrice) }}
                            <span class="text-muted small">/ {{ $plan->points }} credits</span>
                        </div>

                        <div class="fs-5 mt-2 fw-semibold">{{ $plan->plan_name }}</div>
                        <div class="text-muted small">{{ $plan->description ?? 'Rent Package' }}</div>
                        @if (!empty($plan->total_month_limit))
                            <div class="text-muted small">{{ $plan->total_month_limit }} Days validity</div>
                        @endif

                        <div class="flex-grow-1"></div>

                        <div class="mt-3">
                            @if($isRentActive)
                                <button class="btn btn-success w-100 fw-semibold" disabled>
                                    Active
                                </button>
                            @elseif($hasRentPlan)
                                <button class="btn btn-secondary w-100 fw-semibold" onclick="$('#alreadyPurchasedModal').modal('show')">
                                    Buy Package
                                </button>
                            @else
                                <button class="btn btn-outline-primary w-100 fw-semibold buy-rent-plan-btn"
                                    data-amount="{{ $displayPrice }}"
                                    data-days="{{ $plan->points }}"
                                    data-points="{{ $plan->points }}"
                                    data-plan-key="{{ $plan->plan_key }}"
                                    data-plan-name="{{ $plan->plan_name }}">
                                    Buy Package
                                </button>
                            @endif
                        </div>
                    </div>
                </div>
            @empty
                <div class="col-12 text-center py-5">
                    <h5 class="text-muted">No Rent/Lease packages available at the moment.</h5>
                </div>
            @endforelse
        </div>
    </div>
</div>
<div class="modal fade" id="alreadyPurchasedModal" tabindex="-1" aria-labelledby="alreadyPurchasedModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered">
        <div class="modal-content text-center p-4">
            <h5 class="modal-title mb-3" id="alreadyPurchasedModalLabel">Notice</h5>
            <p>You have already purchased a package.</p>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
        </div>
    </div>
</div>

</div>
    
</div>
<style>
    .image-customer {
        overflow: hidden;
        border-radius: 12px;
        transition: all 0.4s ease-in-out;
        padding: 2%;
        padding-right: 50%;
        background: white;
    }
    .top-customer-image {
        position: absolute;
        top: 20px;
        left: 10px;
        right: 340px;
        display: flex;
        justify-content: space-between;
        align-items: start;
        padding: 0 10px;
        z-index: 2;
    }
    .customer-content {
        position: absolute;
        left: 380px;
        bottom: 60px;
    }
    .customer-btn {
        position: absolute;
        top: 50%;
        left: 25%;
        opacity: 0;
        visibility: hidden;
        backdrop-filter: blur(20px);
        border-radius: 50%;
        transform: translate(-50%, -30%);
        transition: all 0.3s ease-in-out;
        z-index: 1;
    }
    .bottom-customer-image {
        position: absolute;
        display: flex;
        justify-content: space-between;
        align-items: end;
        padding: 0 10px;
        z-index: 2;
        top: 240px;
    }
</style>

</div>
</div>
</div>
</div>
</div>
</section>
@endsection
@section('scripts')
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
<script>
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('filter') === 'rent') {
        $('#sell-credit-section').hide();
        $('#rent-credit-section').show();
        $('.btn-filter-credit[data-filter="rent"]').css({
            'background-color': '#163d75',
            'color': 'white'
        }).addClass('active');
        $('.btn-filter-credit[data-filter="sell"]').css({
            'background-color': 'white',
            'color': '#163d75'
        }).removeClass('active');
    }

    // Update URL when tab is clicked
    $('.tab-link').on('click', function () {
        let target = $(this).attr('data-bs-target') || $(this).attr('href');
        if (target) {
            let tabName = target.replace('#', '');
            let url = new URL(window.location.href);
            url.searchParams.set('tab', tabName);
            history.replaceState(null, '', url.toString());
        }
    });

    $('.btn-filter-credit').on('click', function() {
        const filter = $(this).data('filter');
        $('.btn-filter-credit').css({
            'background-color': 'white',
            'color': '#163d75'
        }).removeClass('active');

        $(this).css({
            'background-color': '#163d75',
            'color': 'white'
        }).addClass('active');

        if (filter === 'sell') {
            $('#sell-credit-section').show();
            $('#rent-credit-section').hide();
        } else {
            $('#sell-credit-section').hide();
            $('#rent-credit-section').show();
        }
    });
</script>
<script>
$(document).ready(function () {
    let customerId = "{{ session('customer_id') }}";
    $(document).on('click', '.buy-rent-plan-btn', function () {
        let button = $(this);
        let amount = button.data('amount');
        let days = button.data('days');
        let planKey = button.data('plan-key');
        let planName = button.data('plan-name');

        button.prop('disabled', true).text('Processing...');

        $.post("{{ route('rent.access.order') }}", {
            _token: '{{ csrf_token() }}',
            amount: amount,
            days: days,
            plan_key: planKey,
            plan_name: planName,
            customer_id: customerId
        }, function (response) {
            let options = {
                "key": response.razorpay_key,
                "amount": response.amount * 100,
                "currency": "INR",
                "name": "Houselink 360",
                "description": planName,
                "order_id": response.order_id,
                "handler": function (payment) {
                    $.post("{{ route('rent.access.success') }}", {
                        _token: '{{ csrf_token() }}',
                        razorpay_payment_id: payment.razorpay_payment_id,
                        razorpay_order_id: payment.razorpay_order_id,
                        amount: amount,
                        days: days,
                        plan_key: planKey,
                        plan_name: planName,
                        customer_id: customerId
                    }, function (res) {
                        if (res.success) {
                            alert('Payment successful! Rent/Lease plan activated.');
                            window.location.href = "{{ route('customer.dashboard') }}";
                        } else {
                            alert('Verification failed. Please contact support.');
                            button.prop('disabled', false).text('Buy Package');
                        }
                    }).fail(function () {
                        alert('Failed to verify payment.');
                        button.prop('disabled', false).text('Buy Package');
                    });
                },
                "modal": {
                    "ondismiss": function () {
                        button.prop('disabled', false).text('Buy Package');
                    }
                },
                "theme": { "color": "#163d75" }
            };
            let rzp = new Razorpay(options);
            rzp.open();
        }).fail(function () {
            alert('Failed to create order.');
            button.prop('disabled', false).text('Buy Package');
        });
    });
});
</script>
<script>
    $(document).ready(function () {
        $('.show-purchase-alert').on('click', function (e) {
            e.preventDefault();
            $('#alreadyPurchasedModal').modal('show');
        });
    });
</script>

<script>
$(document).ready(function() {
    let customerId = "{{ session('customer_id') }}";
    const userType = "{{ $package->user_type ?? 'owner' }}";
    $('.buy-package-btn').on('click', function(e) {
        e.preventDefault();
        let button = $(this);
        let packageId = button.data('id');
        $.post("{{ route('razorpay.order') }}", {
            _token: '{{ csrf_token() }}',
            package_id: packageId,
            customer_id: customerId
        }, function(response) {
            if (response.free) {
                alert(response.message);
                window.location.href = "{{ route('customer.dashboard') }}"; 
                return
            }
 
            let options = {
                "key": response.razorpay_key,
                "amount": response.amount,
                "currency": "INR",
                "name": "Houselink 360",
                "description": "Package Purchase",
                "order_id": response.order_id,
                "handler": function(payment) {
                    $.post("/api/razorpay/success", {
                        _token: '{{ csrf_token() }}',
                        razorpay_payment_id: payment.razorpay_payment_id,
                        razorpay_order_id: payment.razorpay_order_id,
                        package_id: packageId,
                        customer_id: customerId,
                        user_type: userType
                    }, function(res) {
                        alert('Payment successful!');
                        console.log(res);
                        window.location.href = "{{ route('customer.dashboard') }}";
                    }).fail(function(xhr) {
                        alert('Failed to record payment.');
                        console.error(xhr.responseText);
                    });
                },
                "theme": {
                    "color": "blue"
                }
            };
            let rzp = new Razorpay(options);
            rzp.open();
        }).fail(function(xhr) {
            alert('Failed to create Razorpay order.');
            console.error(xhr.responseText);
        });
    });
});
</script>
<script>
    (function() {
        let selectOwnerType = 'owner';  // Default to 'owner'
        let selectedStatus = 'expired';  // Default to 'live'
        function loadProperties() {
            if (!selectOwnerType || !selectedStatus) return;
            $.ajax({
                url: "{{ route('filter-properties') }}",
                method: "GET",
                data: {
                    owner_type: selectOwnerType,
                    status: selectedStatus
                },
                success: function (res) {
                    if (res.status) {
                        let html = '';
                        if (res.properties.length > 0) {
                            res.properties.forEach(function (property) {
                                let categoryClass = property.category_id === 1 ? 'category-featured' : 'category-normal';
                                let type = {
                                    'Owner': 'Owner',
                                    'Builder': 'Builder',
                                    'Consultant': 'Consultant'
                                }[property.owner_type] || 'Null';  // Default to 'Consultant' if not found
                                const id = property.id || 'Unknown';
                                const url = "{{ route('dashboard.section', ['type' => 'edit-property', 'id' => ':id']) }}".replace(':id', id);
                                let categoryName = property.category_name || 'Unknown';
                                let description = property.description || 'No description available.';
                                const price = property.price
  ? new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(property.price)
  : 'N/A';
                                let city = property.city ? property.city.name : 'No City';  // Access city name
                                let state = property.state ? property.state.name : 'No State'; // Replace with actual state name logic if needed
                                let featuresList = '';
                                const assetBaseUrl = "{{ asset('') }}";

                                if (property.features && property.features.length > 0) {
                                    featuresList = '<div class="features-wrap d-flex gap-2 flex-wrap">';
                                    property.features.forEach(function (feature) {
                                    const iconPath = assetBaseUrl +'/storage/'+ feature.keyfeature?.key_icon;
                                        featuresList += `<span class="feature-item" style="font-weight: bold;"><img src="${iconPath}"  style="width: 16px; height: 16px; margin-right: 4px;" />${feature.keyfeature?.keyfeatures_name || 'Unknown'}</span>`;
                                    });
                                    featuresList += '</div>';
                                }
                                let imagesHTML = '';
                                property.images.forEach(function (image) {
                                    imagesHTML += `<img  src="${image.image_url}" alt="${property.name}"  class="img-fluid listingimg rounded-3">`;
                                });
                                html += `<div class="container my-4">
                                    <a href="${url}">
  <div class="row justify-content-center">
    <div class="col-12 col-md-10">
      <div class="card shadow-sm border-0 rounded-4 p-3">
        <div class="d-flex flex-column flex-md-row gap-3">

          <!-- Image Section -->
          <div class="position-relative  w-md-50 rounded-3 overflow-hidden">
            ${imagesHTML}
            <!-- Top Tags -->
            <div class="position-absolute top-0 start-0 p-2 d-flex gap-2">
              <span class="flag-tag success">${property.is_featured ? 'Featured' : ''}</span>
              <span class="flag-tag primary">${type}</span>
            </div>

            <!-- Bottom Tag -->
            <div class="position-absolute bottom-0 start-0 p-2">
              <span class="flag-tag style-2">${categoryName}</span>
            </div>
          </div>

          <!-- Details Section -->
          <div class="flex-grow-1 d-flex flex-column justify-content-between">
            <div>
              <h5 class="text-dark fw-bold mb-1">Test Place 3</h5>
              <p class="text-muted mb-2">
                <i class="fas fa-map-marker-alt me-1 text-dark"></i> Bangalore Rural, Karnataka
              </p>

              <!-- Features -->
              <div class="d-flex flex-wrap gap-2">
                <div class="content-customer">
                                                    <h5 class="capitalize-name" style="color: black;    margin-bottom: 1%;    margin-top: 2%;">${property.name}</h5><br>
                                                    <h6 class="capitalize-name" style="color: black;"><i style="color:#212529" class="fas fa-map-marker-alt" ></i> ${city}, ${state}</h6>
                                                    <br>${featuresList}
                                                    <hr><h5 class="price mt-0" style="font-weight: 500;">${price}</h5>
                                                </div>
                </div>
            </div>

            
          </div>

        </div>
      </div>
    </div>
  </div>
</a>
</div>

`;
                            });
                        } else {
                            html = `<center class="mt-3"><img src="https://www.societyonrent.com/assets/css/images/noProperty.png"></center>`;
                        }
                        $('#propertyResults').html(html);
                    }
                }
            });
        }
        loadProperties();
        $('.tab-link').on('click', function (e) {
            e.preventDefault();
            selectOwnerType = $(this).data('type');
            $('.tab-link').removeClass('active');
            $(this).addClass('active');
            loadProperties();
        });
        $('.status-btn').on('click', function () {
            selectedStatus = $(this).data('status');
            $('.status-btn').removeClass('active');
            $(this).addClass('active');
            loadProperties();
        });
    })();
</script>
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
</script>
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