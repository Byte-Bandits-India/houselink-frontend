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
                                            <h2 style="color: #163d75">Expired Property
                                            </h2>
                                        </div>
                                        {{-- ✅ Buy/Rent Filter Buttons --}}
                                  <div class="d-flex gap-2 mb-3">
                                    <button type="button" class="btn btn-filter-purpose active" data-purpose="sell" data-type="buy"
                                            style="background-color: #163d75; color: white; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px;">
                                            Sell
                                        </button>
                                        <button type="button" class="btn btn-filter-purpose" data-purpose="rent" data-type="lease"
                                            style="background-color: white; color: #163d75; border: 1px solid #163d75; padding: 8px 25px; border-radius: 6px;">
                                            Rent/Lease
                                        </button>
                                    </div>

                                    </div>
                                </div>
                            </div>

                            <div class="container">
                                <div class="row">
                                    <div class="col-12 pb-2">
                                       <ul class="nav nav-tabs w-100 border" id="ownerTabs">
                                            <li class="nav-item flex-fill text-center">
                                                <a href="#" class="nav-link active tab-link border-end" data-type="owner">Owner</a>
                                            </li>
                                            <li class="nav-item flex-fill text-center" id="builderTab">
                                                <a href="#" class="nav-link tab-link border-end" data-type="builder">Builder</a>
                                            </li>
                                            <li class="nav-item flex-fill text-center">
                                                <a href="#" class="nav-link tab-link" data-type="consultant">Consultant</a>
                                            </li>
                                        </ul>

                                        <div id="propertyResults" class="mt-4">
                                            <p>Select an owner type and status to load properties.</p>
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
    <!-- Archive Confirmation Modal -->
    <div class="modal fade" id="archiveModal" tabindex="-1" aria-labelledby="archiveModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog"> <!-- just added this class -->
            <form id="archiveForm">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title">Delete Property</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <input type="hidden" id="archivePropertyId" name="property_id">
                <div class="mb-3">
                    <label for="archiveReason" class="form-label">Reason for Deleting</label>
                    <textarea class="form-control" id="archiveReason" name="reject_reason" rows="3" required></textarea>
                </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-secondary" style="background-color: #003366; color: white;" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" class="btn btn-danger">Delete</button>
                </div>
            </div>
            </form>
        </div>
        </div>
    <!-- End Archive Confirmation Modal -->

    <!-- Success Modal -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content text-center p-4">
            <h5 class="modal-title mb-3" id="successModalLabel">Success</h5>
            <p>Property deleted successfully!</p>
            <button type="button" class="btn btn-success" data-bs-dismiss="modal">OK</button>
            </div>
        </div>
    </div>
    <!-- End Success Modal -->
@endsection
@section('scripts')
    <script>
        (function() {
            let selectOwnerType = 'owner';  // Default to 'owner'
            let selectPropertyPurpose = 'sell'; // ✅ Default: Buy (sell)
            let archiveModal = new bootstrap.Modal(document.getElementById('archiveModal'));

            window.archiveProperty = function(propertyId) {
                // Set the property ID in a hidden field
                $('#archivePropertyId').val(propertyId);
                $('#archiveReason').val('');
                archiveModal.show();
            };

            // Handle form submission
            $('#archiveForm').on('submit', function(e) {
                e.preventDefault();

                let propertyId = $('#archivePropertyId').val();
                let reason = $('#archiveReason').val();

                if (!reason.trim()) {
                    alert('Please enter a reason.');
                    return;
                }

                $.ajax({
                    url: `/properties/${propertyId}/archive`,
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    },
                    data: {
                        reject_reason: reason
                    },
                    success: function(response) {
                        archiveModal.hide();
                        
                        let successModal = new bootstrap.Modal(document.getElementById('successModal'));
                        successModal.show();

                        loadProperties();
                    },
                    error: function(xhr, status, error) {
                        alert('An error occurred while deleting the property.');
                        console.error(xhr.responseText);
                    }
                });
            });

          function loadProperties() {
    if (!selectOwnerType) return;

    $('#propertyResults').html('<div class="text-center my-4"><i class="fa fa-spinner fa-spin fa-3x"></i><p class="mt-2">Loading properties...</p></div>');

    $.ajax({
        url: "{{ route('expired-filter-properties') }}",
        method: "GET",
        data: {
            owner_type: selectOwnerType,
            property_purpose: selectPropertyPurpose
        },
        success: function (res) {
            if (res.status) {
                let html = '';
                if (res.properties.length > 0) {
                    html += `
                        <div class="table-responsive">
                            <table class="table table-hover table-striped table-bordered align-middle">
                                <thead class="table-primary">
                                    <tr>
                                        <th scope="col">Property Name</th>
                                        <th scope="col" style="width: 100px;">Views</th>
                                        <th scope="col" style="width: 100px;">Unique ID</th>
                                        <th scope="col" style="width: 100px;">Expiry Date</th>
                                        <th scope="col" style="width: 100px;">Created At</th>
                                        <th scope="col" style="width: 150px;">Status</th>
                                        <th scope="col" style="width: 150px;">Moderation</th>
                                        <th scope="col" style="width: 150px;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                    `;

                    res.properties.forEach(function (property) {
                        if (property.moderation_status === 'archived') return;
                        
                        const id = property.id || 'Unknown';
                        const url = "{{ route('dashboard.section', ['type' => 'edit-property', 'id' => ':id']) }}".replace(':id', id);

                        let views = property.views;
                        let uniqueid = property.id;
                        
                        // ✅ Handle Expiry Date based on filter type
                        let expirydate = '';
                        if (selectPropertyPurpose === 'rent') {
                            // For Rent/Lease: Show property_expire_status
                            expirydate = property.property_expire_status || 'N/A';
                            // Capitalize first letter
                            if (expirydate !== 'N/A') {
                                expirydate = expirydate.charAt(0).toUpperCase() + expirydate.slice(1);
                            }
                        } else {
                            // For Buy/Sell: Show expired_at date
                            expirydate = property.expired_at;
                            if (expirydate) {
                                const date = new Date(expirydate);
                                if (!isNaN(date.getTime())) {
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    expirydate = `${day}-${month}-${year}`;
                                } else {
                                    expirydate = 'Invalid Date';
                                }
                            } else {
                                expirydate = 'N/A';
                            }
                        }

                        // Format Created At date
                        let createdat = property.created_at;
                        const createdDate = new Date(createdat);
                        if (!isNaN(createdDate.getTime())) {
                            const day = String(createdDate.getDate()).padStart(2, '0');
                            const month = String(createdDate.getMonth() + 1).padStart(2, '0');
                            const year = createdDate.getFullYear();
                            createdat = `${day}-${month}-${year}`;
                        } else {
                            createdat = 'Invalid Date';
                        }

                        let status = property.status ? property.status : 'Selling';
                        let moderation_status = property.moderation_status ? property.moderation_status : 'Pending';

                        html += `
                            <tr>
                                <td>
                                    <h6 class="mb-1 fw-bold text-dark">${property.name || 'N/A'}</h6>
                                </td>
                                <td>${views}</td>
                                <td>
                                    <h6 class="mb-1 fw-bold text-dark">${uniqueid || 'N/A'}</h6>
                                </td>
                                <td>
                                    <span class="fw-bold text-success">${expirydate}</span>
                                </td>
                                <td>${createdat}</td>
                                <td>
                                    <span class="badge bg-info mt-1">${status}</span>
                                </td>
                                <td>
                                    <span class="badge bg-primary">${moderation_status}</span>
                                </td>
                                <td>
                                    <a href="${url}" class="btn btn-sm btn-outline-primary mb-1 d-block" title="Edit Property">
                                        <i class="fas fa-edit me-1"></i> Edit
                                    </a>
                                    <button type="button" class="btn btn-sm btn-outline-danger d-block w-100" onclick="archiveProperty('${id}')" title="Delete Property">
                                        <i class="fas fa-trash-alt me-1"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        `;
                    });

                    html += `
                                </tbody>
                            </table>
                        </div>
                    `;
                } else {
                    html = `<center class="mt-5">
                                <img src="{{ asset('assets/noProperty.png') }}" alt="No Properties" style="max-width: 75px;">
                                <p class="text-muted mt-3">No properties found for this type.</p>
                            </center>`;
                }
                $('#propertyResults').html(html);
            } else {
                $('#propertyResults').html(`<div class="alert alert-danger text-center">Failed to load properties: ${res.message || 'Unknown error'}</div>`);
                console.error('API Error:', res);
            }
        },
        error: function (xhr, status, error) {
            $('#propertyResults').html('<div class="alert alert-danger text-center">An error occurred while fetching properties. Please try again.</div>');
            console.error('AJAX Error:', status, error, xhr.responseText);
        }
    });
}


            // ✅ Buy/Rent Filter Click Handler (MOVED HERE - INSIDE SCOPE)
            // ✅ Buy/Rent Filter Click Handler with Hide/Show Logic
$('.btn-filter-purpose').on('click', function() {
    selectPropertyPurpose = $(this).data('purpose');
    let isRentLease = $(this).data('type') === 'lease';
    
    // ✅ Hide/Show Builder Tab
    if (isRentLease) {
        $('#builderTab').hide();
        // If Builder tab was active, switch to Owner
        if (selectOwnerType === 'builder') {
            selectOwnerType = 'owner';
            $('.tab-link[data-type="owner"]').addClass('active');
            $('.tab-link[data-type="builder"]').removeClass('active');
        }
    } else {
        $('#builderTab').show();
    }
    
    // Update button styles
    $('.btn-filter-purpose').css({
        'background-color': 'white',
        'color': '#163d75'
    }).removeClass('active');
    
    $(this).css({
        'background-color': '#163d75',
        'color': 'white'
    }).addClass('active');
    
    // Reload properties with new filter
    loadProperties();
});


            // Initialize with default values and load properties on page load
            loadProperties();

            // Tab click handler (Owner/Builder/Consultant)
            $('.tab-link').on('click', function (e) {
                e.preventDefault();
                selectOwnerType = $(this).data('type');
                $('.tab-link').removeClass('active');
                $(this).addClass('active');
                loadProperties();
            });
        })(); // Self-invoking function
    </script>

    <script>
        $(document).ready(function () {
            function loadDashboardSection(url) {
                $('#dashboard-content').html('<div class="text-center"><i class="fas fa-spinner fa-spin fa-2x"></i></div>');
                $.get(url, function (data) {
                    $('#dashboard-content').html(data);
                }).fail(function () {
                    $('#dashboard-content').html('<div class="alert alert-danger text-center">Failed to load dashboard section.</div>');
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
@endsection