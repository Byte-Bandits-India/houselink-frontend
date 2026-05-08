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
.thead-dark{
    background-color: #163d75; 
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
                                    
                                    <div class="container-fluid">
                <div class="row">
                    <div class="col-md-12">
                                <div class="d-flex justify-content-between align-items-center mb-4">
                        <h2 id="dynamic-lead-title" style="color: #163d75;">Loading...</h2> 
                    </div>
                    {{-- Filter Buttons --}}
    <div class="mb-4">
        <div class="filter-btn-group" role="group" aria-label="Property Type Filter">
            
            {{-- Button 1: Sell/Buy --}}
            <button type="button" class="btn" id="btn-filter-sell" onclick="applyFilter('sell')">
                Sell
            </button>
            
            {{-- Button 2: Rent --}}
            <button type="button" class="btn" id="btn-filter-rent" onclick="applyFilter('rent')">
                Rent/Lease
            </button>

        </div>
    </div>
 <style>
    /* Filter Button Group Styling */
    .filter-btn-group {
        display: flex; /* Flexbox for alignment */
        gap: 15px;    /* Space between buttons */
        margin-bottom: 20px;
    }

    .filter-btn-group .btn {
        border-radius: 4px; /* Slightly rounded corners like screenshot */
        font-weight: 500;
        font-size: 16px;
        letter-spacing: 0.5px;
        padding: 8px 30px; /* Wider buttons */
        transition: all 0.3s ease;
        border: 1.5px solid #163d75; /* Default border color */
        background-color: transparent;
        color: #163d75;
        min-width: 100px; /* Ensure minimum width */
        text-align: center;
    }

    /* Hover State */
    .filter-btn-group .btn:hover {
        background-color: #f0f4f8;
        color: #163d75;
        border-color: #163d75;
    }

    /* Active State (Selected Button) */
    .filter-btn-group .btn.active {
        background-color: #163d75 !important; /* Blue background */
        color: #fff !important; /* White text */
        border-color: #163d75 !important;
        box-shadow: 0 4px 6px rgba(22, 61, 117, 0.2); /* Slight shadow for depth */
    }

    /* Focus State (Remove default outline) */
    .filter-btn-group .btn:focus {
        box-shadow: 0 0 0 3px rgba(22, 61, 117, 0.25);
    }
</style>
                    

            @if(isset($agent_enquries) && count($agent_enquries) > 0)
                <div class="d-flex justify-content-end" style="padding: 16px;">
                 <a href="{{ route('customer.leads.download', [
    'type' => request('type'), 
    'property_for' => request('property_for') 
]) }}" class="btn btn-success mb-3">
    <i class="fas fa-download"></i> Download
</a>
                </div>
                @endif
            <div class="table-responsive">
        <table class="table table-hover table-striped table-bordered align-middle">
            <thead class="table-primary">
                <tr>
                    <th scope="col">#</th>
                <th scope="col">Date</th>
                <th scope="col">Property</th>
                <th scope="col" id="th-name">Name</th>
                <th scope="col" id="th-phone">Phone</th>
                <th scope="col" id="th-email">Email</th>
                <th scope="col" id="th-message">Message</th>
                </tr>
            </thead>
            <tbody>
                @php $i = 1; @endphp
                @forelse ($agent_enquries as $item)
                    <tr>
                        <th scope="row">{{ $i++ }}</th>
                        <td>{{ \Carbon\Carbon::parse($item->created_at)->format('d-m-Y') }}</td>
                        <td>{{ $item->proname }}</td>
                        <td>{{ $item->name }}</td>
                        <td>{{ $item->phone }}</td>
                        <td>{{ $item->email }}</td>
                        <td>{{ $item->message }}</td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center py-5">
                            <i class="fas fa-address-book fa-3x text-muted mb-3"></i><br>
                            <strong>No leads found.</strong><br>
                            <small>New leads will appear here.</small>
                        </td>
                    </tr>
                @endforelse
        </tbody>
    </table>
        </div>
            </div>
            </div>
        </div>
        <script>
        const urlParams = new URLSearchParams(window.location.search);
        const typeValue = urlParams.get('type');

        let headingText, nameText, phoneText, emailText, messageText;

        if (typeValue === 'property_enquired_by_me') {
            // My Enquires - Owner perspective
            headingText = "My Enquires";
            nameText = "Owner Name";
            phoneText = "Owner Phone";
            emailText = "Owner Email";
            messageText = "My Message";
        } else {
                        // Property Leads - Customer perspective
                headingText = "Property Leads"; 
                nameText = "Customer Name";
                phoneText = "Customer Phone";
                emailText = "Customer Email";
                messageText = "Message From Customer";
            }

            // Update heading
            document.getElementById('dynamic-lead-title').textContent = headingText;

            // Update table headers
            document.getElementById('th-name').textContent = nameText;
            document.getElementById('th-phone').textContent = phoneText;
            document.getElementById('th-email').textContent = emailText;
            document.getElementById('th-message').textContent = messageText;
            </script> 
            <div class="container py-4">
            
                
        </div>
                {{-- Razorpay Script --}}

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

    table td,
table th {
    padding: 20px 20px !important; /* Adjust padding as needed */
    vertical-align: middle;
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
                                // Dynamically assign values based on returned property data
                                let categoryClass = property.category_id === 1 ? 'category-featured' : 'category-normal';
                                let type = {
                                    'Owner': 'Owner',
                                    'Builder': 'Builder',
                                    'Consultant': 'Consultant'
                                }[property.owner_type] || 'Null';  // Default to 'Consultant' if not found
                                // JavaScript
                                const id = property.id || 'Unknown';
                                // Generate the URL for edit-property
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
                                // Extract features from the property (which is now a list of feature names)
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
                                // Initialize images array to store property images
                                let imagesHTML = '';
                                property.images.forEach(function (image) {
                                    // Generate HTML for each image
                                    imagesHTML += `<img  src="${image.image_url}" alt="${property.name}"  class="img-fluid listingimg rounded-3">`;
                                });
                                // Create HTML output for each property
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
        // Initialize with default values and load properties on page load
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
// Load default section on page load
let defaultUrl = $('.dashboard-link.active').data('url');
if (defaultUrl) {
loadDashboardSection(defaultUrl);
}
// Navigation click handler
$('.dashboard-link').on('click', function (e) {
e.preventDefault();
$('.dashboard-link').removeClass('active');
$(this).addClass('active');
let url = $(this).data('url');
loadDashboardSection(url);
// Auto-close sidebar on mobile
if ($(window).width() < 768) {
$('#dashboardSidebar').collapse('hide');
}
});
// Handle hash from external links
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

<script>
    document.addEventListener("DOMContentLoaded", function() {
        const urlParams = new URLSearchParams(window.location.search);
        const typeValue = urlParams.get('type');
        let currentFilter = urlParams.get('property_for'); // Get current filter from URL

        // ✅ 1. SET DEFAULT: Agar URL me filter nahi hai, to 'sell' set karke reload karein
        if (!currentFilter) {
            applyFilter('sell');
            return; // Script yahi rok de, page reload hoga
        }

        let headingText, nameText, phoneText, emailText, messageText;
        
        // Elements
        const sellBtn = document.getElementById('btn-filter-sell');
        const rentBtn = document.getElementById('btn-filter-rent');
        
        // ✅ 2. Determine Context (My Enquiries vs Leads) & Change Text
        if (typeValue === 'property_enquired_by_me') {
            // Owner perspective (Maine enquiry ki hai khareedne ke liye)
            headingText = "My Enquiries";
            nameText = "Owner Name";
            phoneText = "Owner Phone";
            emailText = "Owner Email";
            messageText = "My Message";
            
            // Text Change: Sell -> Buy
            if(sellBtn) sellBtn.textContent = "For Sale"; 
        } else {
            // Customer perspective (Logon ne meri property ke liye enquiry ki)
            headingText = "Property Leads";
            nameText = "Customer Name";
            phoneText = "Customer Phone";
            emailText = "Customer Email";
            messageText = "Message From Customer";
            
            // Text remains 'Sell'
            if(sellBtn) sellBtn.textContent = "Sell";
        }

        // ✅ 3. Update Headings
        const titleEl = document.getElementById('dynamic-lead-title');
        if(titleEl) titleEl.textContent = headingText;

        // Update Table Headers
        if(document.getElementById('th-name')) document.getElementById('th-name').textContent = nameText;
        if(document.getElementById('th-phone')) document.getElementById('th-phone').textContent = phoneText;
        if(document.getElementById('th-email')) document.getElementById('th-email').textContent = emailText;
        if(document.getElementById('th-message')) document.getElementById('th-message').textContent = messageText;

        // ✅ 4. Highlight Active Button (Default is already handled above)
        // Reset classes first
        sellBtn.className = 'btn'; 
        rentBtn.className = 'btn';

        if (currentFilter === 'sell') {
            sellBtn.classList.add('active'); // Adds blue bg, white text
        } else if (currentFilter === 'rent' || currentFilter === 'lease') {
            rentBtn.classList.add('active'); // Adds blue bg, white text
        }
    });

    // Function to Reload Page with Filter
    function applyFilter(filterValue) {
        const urlParams = new URLSearchParams(window.location.search);
        
        // Set the property_for parameter
        urlParams.set('property_for', filterValue);
        
        // Reload page
        window.location.search = urlParams.toString();
    }
</script>
@endsection