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
.listingimg{
    width: 60px;
}
.nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    color: #ffffff;
    background-color: #163d75;
    border-color: var(--bs-nav-tabs-link-active-border-color);
}
.btn-outline-primary.active {
    background-color: #0d6efd;
    color: white;
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
                    <!-- Sidebar -->
                    @include('website.layouts.sidebar')
                    <!-- Main Content -->
                    <div class="col-md-10 col-12 py-4" id="dashboard-content">
<div class="container">
    <div class="row">
        <div class="col-md-10">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2 class="mb-0">History</h2>
            </div>
        </div>
    </div>
</div>

{{-- ✅ NEW: Sell / Rent-Lease Toggle Buttons --}}
<div class="container mb-3">
    <div class="row">
        <div class="col-12">
            <div class="d-flex gap-2 mb-3">
                <button type="button" 
                        class="btn btn-filter-history active" 
                        data-type="sell"
                        style="background-color: #163d75; color: white; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px; transition: all 0.3s ease;">
                    Sell
                </button>
                <button type="button" 
                        class="btn btn-filter-history" 
                        data-type="rent"
                        style="background-color: white; color: #163d75; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px; transition: all 0.3s ease;">
                    Rent/Lease
                </button>
            </div>
        </div>
    </div>
</div>

<div class="container mb-3">
    <div class="row">
        <div class="col-12 pb-2">
            <ul class="nav nav-tabs w-100 border" id="ownerTabs">
                <li class="nav-item flex-fill text-center">
                    <a href="javascript:void(0)" class="nav-link active tab-link border-end status-btn" data-status="lived" data-type="owner">Live Packages</a>
                </li>
                <li class="nav-item flex-fill text-center">
                    <a href="javascript:void(0)" class="nav-link tab-link border-end status-btn" data-status="expire">Expired Packages List</a>
                </li>
            </ul>
        </div>
    </div>
</div>

<div class="container py-4">
    <div class="row" id="packageList">
        <p>Loading packages...</p>
    </div>
</div>

</div>
</div>
</div>
</section>
@endsection
@section('scripts')
<script>
    (function() {
        let selectStatus = 'lived';
        let selectType = 'sell';
        
       function loadPackages() {
    $.ajax({
        url: "{{ url('/customer/dashboard/section/leads') }}",
        method: "GET",

                data: {
                    filter: selectStatus,
                    type: selectType
                },
                success: function (res) {
                    console.log('Response:', res); // ✅ Debug
                    let html = '';
                    
                    if (res.status && res.packages.length > 0) {
                        res.packages.forEach(pkg => {
                            const id = pkg.id || 'Unknown';
                            const assetBaseUrl = "{{ asset('') }}" + '/icons/validating-ticket.png';
                            
                            if (selectType === 'rent') {
                                // ✅ RENT/LEASE PACKAGE - Proper field mapping
                                console.log('Package data:', pkg); // Debug
                                
                                let planName = pkg.plan_name || 'Unknown Plan';
                                let totalPoints = pkg.total_points || 0;
                                let remainingPoints = pkg.remaining_points || 0;
                                let planKey = pkg.plan_key || '';

                                // Show final (discounted) price — same logic as credits page
                                let planPrice = parseFloat(pkg.plan_price) || parseFloat(pkg.amount) || 0;
                                let percentSave = parseFloat(pkg.percent_save) || 0;
                                let finalPrice = parseFloat(pkg.plan_final_price) > 0
                                    ? parseFloat(pkg.plan_final_price)
                                    : (percentSave > 0 ? planPrice * (1 - percentSave / 100) : planPrice);
                                let formattedAmount = finalPrice.toFixed(2);
                                
                                let status = remainingPoints > 0 ? 'Live' : 'Expired';
                                let statusLabel = status === 'Live' 
                                    ? '<span class="badge bg-success">Live</span>' 
                                    : '<span class="badge bg-danger">Expired</span>';
                                
                                html += `
                                    <div class="col-md-10 mb-2">
                                        <div class="card">
                                            <div class="card-body row">
                                                <div class="col-2">
                                                    <img src="${assetBaseUrl}" class="img-fluid listingimg rounded-3">
                                                </div>
                                                <div class="col-8">
                                                    <h5 class="card-title">${planName} / Rs.${formattedAmount}</h5>
                                                    <span class="badge bg-info">Type: Rent/Lease</span>
                                                    <span class="badge bg-secondary">Total Points: ${totalPoints}</span>
                                                    <span class="badge bg-warning text-dark">Remaining: ${remainingPoints}</span>
                                                    ${statusLabel}
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            } else {
                                // ✅ SELL PACKAGE (Existing)
                                let expireOn = new Date(pkg.expire_on);
                                let now = new Date();
                                let noOfCredit = parseInt(pkg.no_of_credit) || 0;
                                // Package is Live only if expire_on is in future AND has credits
                                let status = (expireOn > now && noOfCredit > 0) ? 'Lived' : 'Expire';
                                let statusLabel = status === 'Lived'
                                    ? '<span class="badge bg-success">Live</span>'
                                    : '<span class="badge bg-danger">Expired</span>';
                                let UserType = pkg.user_type;
                                let UserTypeLabel = UserType === 'Owner' ? 'Owner'
                                    : UserType === 'Builder' ? 'Builder'
                                    : UserType === 'Consultant' ? 'Consultant'
                                    : 'Unknown';
                                
                                const url = "/customer/invoice/" + pkg.id;
                                
                                html += `
                                    <div class="col-md-10 mb-2">
                                        <div class="card">
                                            <div class="card-body row">
                                                <div class="col-2">
                                                    <img src="${assetBaseUrl}" class="img-fluid listingimg rounded-3">
                                                </div>
                                                <div class="col-8">
                                                    <h5 class="card-title">${pkg.name} / Rs.${(parseFloat(pkg.price) * (1 - (parseFloat(pkg.percent_save) || 0) / 100)).toFixed(2)}</h5>
                                                    <span class="badge bg-danger">User Type: ${UserTypeLabel}</span>
                                                    ${statusLabel}
                                                    <br>
                                                    <a href="${url}" target="_blank" class="btn btn-outline-primary mt-2">View Details</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>`;
                            }
                        });
                    } else {
                        html = `<div class="col-12"><p>No packages found.</p></div>`;
                    }
                    $('#packageList').html(html);
                },
                error: function(xhr, status, error) {
                    console.error('AJAX Error:', error);
                    console.error('Response:', xhr.responseText);
                    $('#packageList').html('<div class="col-12"><p>Error loading packages.</p></div>');
                }
            });
        }
        
        // Initial load
        loadPackages();
        
        // Status button (Live/Expired)
        $('.status-btn').on('click', function () {
            $('.status-btn').removeClass('active');
            $(this).addClass('active');
            selectStatus = $(this).data('status');
            loadPackages();
        }); 

        // Type button (Sell/Rent)
        $('.btn-filter-history').on('click', function() {
            selectType = $(this).data('type');
            
            // Update button styles
            $('.btn-filter-history').css({
                'background-color': 'white',
                'color': '#163d75'
            }).removeClass('active');
            
            $(this).css({
                'background-color': '#163d75',
                'color': 'white'
            }).addClass('active');
            
            // Reset to Live tab
            selectStatus = 'lived';
            $('.status-btn').removeClass('active');
            $('.status-btn[data-status="lived"]').addClass('active');
            
            loadPackages();
        });
    })();
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