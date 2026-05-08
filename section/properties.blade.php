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

        .listingimg {
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

        .dashicons {
            widows: 80px;
            height: 80px;
        }

        .icontitle {
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
                            <button class="btn btn-outline-primary w-100" type="button" data-bs-toggle="collapse"
                                    data-bs-target="#dashboardSidebar" aria-expanded="false"
                                    aria-controls="dashboardSidebar">
                                <i class="fas fa-bars"></i> Menu
                            </button>
                        </div>
                       
                         @include('website.layouts.sidebar')

                        <!-- Main Content -->
                        <div class="col-md-10 col-12 py-4" id="dashboard-content">
                            @if (session('success'))
                                <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
                                    <div class="toast align-items-center text-bg-light border-0 show" role="alert">
                                        <div class="d-flex">
                                            <div class="toast-body">
                                                {{ session('success') }}
                                            </div>
                                            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                                        </div>
                                    </div>
                                </div>
                            @endif 
                           
                            <div class="container">
                                <div class="row justify-content-center">
                                    <div class="col-md-12">
                                        <div class="d-flex justify-content-between align-items-center mb-4">
                                            <h2 style="color: #163d75">Property</h2>
                                            <button type="button" class="btn btn-outline-primary"
                                                onclick="window.location='{{ route('dashboard.section', ['type' => 'add-property']) }}'">
                                                <i class="fa fa-plus"></i> Add Property
                                            </button>
                                        </div>

                                        {{-- ✅ Buy/Rent Filter Buttons with data-type --}}
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
                                                <a href="#" class="nav-link tab-link border-end {{ $ownerType === 'Owner' ? 'active' : '' }}"
                                                   data-type="owner">Owner</a>
                                            </li>
                                            <li class="nav-item flex-fill text-center" id="builderTab">
                                                <a href="#" class="nav-link tab-link border-end {{ $ownerType === 'Builder' ? 'active' : '' }}" data-type="builder">Builder</a>
                                            </li>
                                            <li class="nav-item flex-fill text-center">
                                                <a href="#" class="nav-link tab-link {{ $ownerType === 'Consultant' ? 'active' : '' }}"
                                                   data-type="consultant">Consultant</a>
                                            </li>
                                        </ul>
                                       
                                        <div id="propertyResults" class="mt-4">
                                            <p>Select an owner type and status to load properties.</p>
                                        </div>

                                            <div class="row justify-content-center mt-8" id="creditMessage" style="display:none;">
                                                <div class="col-md-8 mt-8">
                                                    <div class="text-center py-4" style="font-size:1.2rem;">
                                                        <p>Post a property to display here</p>
                                                        <a href="{{ route('dashboard.section', ['type' => 'add-property']) }}" class="btn btn-sm btn-primary mx-2">Add Property</a>
                                                    </div>
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

    <!-- Archive Confirmation Modal -->
    <div class="modal fade" id="archiveModal" tabindex="-1" aria-labelledby="archiveModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog">
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
    (function () {
        let selectOwnerType = 'Owner';
        let selectPropertyPurpose = 'sell';
        let isRentLease = false; 
       
        let archiveModal = new bootstrap.Modal(document.getElementById('archiveModal'));

        window.archiveProperty = function(propertyId) {
            $('#archivePropertyId').val(propertyId);
            $('#archiveReason').val('');
            archiveModal.show();
        };

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
                xhrFields: {
                    withCredentials: true
                },
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
                url: "{{ route('filter-properties') }}",
                method: "GET",
                data: {
                    owner_type: selectOwnerType,
                    property_purpose: selectPropertyPurpose
                },
                success: function (res) {
                    if (res.status) {
                        let html = '';
                        $('#creditMessage').hide();
                        if (res.properties.length > 0) {
                            // ✅ DYNAMIC TABLE HEADERS
                            let tableHeaders = `
                                <tr>
                                    <th scope="col">Property Name</th>
                                    <th scope="col" style="width: 100px;">Views</th>
                                    <th scope="col" style="width: 100px;">Unique ID</th>
                                    <th scope="col" style="width: 100px;">Expiry Date</th>
                                    <th scope="col" style="width: 100px;">Created At</th>
                                    <th scope="col" style="width: 150px;">Status</th>`;

                            tableHeaders += `
                                    <th scope="col" style="width: 150px;">Moderation</th>
                                    <th scope="col" style="width: 150px;">Actions</th>
                                </tr>`;

                            html += `
                                <div class="table-responsive">
                                    <table class="table table-hover table-striped table-bordered align-middle">
                                        <thead class="table-primary">
                                            ${tableHeaders}
                                        </thead>
                                        <tbody>
                            `;

                            res.properties.forEach(function (property) {
                                if (property.moderation_status === 'archived') return;
                                
                                const id = property.id || 'Unknown';
                                const url = "{{ route('dashboard.section', ['type' => 'edit-property', 'id' => ':id']) }}".replace(':id', id);

                                let moderation_status = property.moderation_status ? property.moderation_status : 'Pending';
                                let views = property.views;
                                let uniqueid = property.id;
                                let expirydate = '';

                                if (selectPropertyPurpose === 'rent') {
                                    expirydate = property.property_expire_status || 'N/A';
                                    if (expirydate !== 'N/A') {
                                        expirydate = expirydate.charAt(0).toUpperCase() + expirydate.slice(1);
                                    }
                                } else {
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

                                let createdat = property.created_at;
                                const date = new Date(createdat);
                                if (!isNaN(date.getTime())) {
                                    const day = String(date.getDate()).padStart(2, '0');
                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                    const year = date.getFullYear();
                                    createdat = `${day}-${month}-${year}`;
                                }

                                let status = property.status ? property.status : 'Selling';

                                // ✅ Builder column (only for Buy/Sell)
                                html += `
                                    <tr>
                                        <td><h6 class="mb-1 fw-bold text-dark">${property.name || 'N/A'}</h6></td>
                                        <td>${views}</td>
                                        <td><h6 class="mb-1 fw-bold text-dark">${uniqueid || 'N/A'}</h6></td>
                                        <td><span class="fw-bold text-success">${expirydate}</span></td>
                                        <td>${createdat}</td>
                                        <td><span class="badge bg-info mt-1">${status}</span></td>
                                        <td><span class="badge bg-primary">${moderation_status}</span></td>
                                        <td>
                                            ${moderation_status !== 'pending' ?
                                                `<a href="${url}?mode=edit" class="btn btn-sm btn-outline-primary mb-1 d-block" title="Edit Property">
                                                    <i class="fas fa-edit me-1"></i> Edit
                                                </a>` :
                                                `<a href="${url}?mode=view" class="btn btn-sm btn-outline-primary mb-1 d-block" title="View Property">
                                                    <i class="fas fa-eye me-1"></i> View
                                                </a>`
                                            }
                                            <button type="button" class="btn btn-sm btn-outline-danger d-block w-100" onclick="archiveProperty('${id}')" title="Delete Property">
                                                <i class="fas fa-trash-alt me-1"></i> Delete
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            });

                            html += `</tbody></table></div>`;
                        } else {
                            html = '';
                            $('#creditMessage').show();
                        }
                        $('#propertyResults').html(html);
                    } else {
                        $('#propertyResults').html(`<div class="alert alert-danger text-center">Failed to load properties: ${res.message || 'Unknown error'}</div>`);
                    }
                },
                error: function (xhr, status, error) {
                    $('#propertyResults').html('<div class="alert alert-danger text-center">An error occurred while fetching properties. Please try again.</div>');
                    console.error('AJAX Error:', status, error, xhr.responseText);
                }
            });
        }

        // ✅ Buy/Rent Filter Click Handler with Show/Hide Logic
        $('.btn-filter-purpose').on('click', function() {
            selectPropertyPurpose = $(this).data('purpose');
            isRentLease = $(this).data('type') === 'lease'; // true for Rent, false for Buy
            
            // ✅ Hide/Show Builder Tab
            if (isRentLease) {
                $('#builderTab').hide();
                // If Builder tab was active, switch to Owner
                if (selectOwnerType === 'Builder') {
                    selectOwnerType = 'Owner';
                    $('.tab-link[data-type="owner"]').addClass('active');
                    $('.tab-link[data-type="builder"]').removeClass('active');
                }
            } else {
                $('#builderTab').show();
            }
            
            // Update button styles
            $('.btn-filter-purpose').css({'background-color': 'white', 'color': '#163d75'}).removeClass('active');
            $(this).css({'background-color': '#163d75', 'color': 'white'}).addClass('active');
            
            loadProperties();
        });

        // Initialize
        loadProperties();

        // Tab click handler
        $('.tab-link').on('click', function (e) {
            e.preventDefault();
            selectOwnerType = $(this).data('type');
            $('.tab-link').removeClass('active');
            $(this).addClass('active');
            // Update "Purchase a package" link to match the active tab
            let tabName = selectOwnerType.toLowerCase();
            let baseUrl = "{{ route('dashboard.section', ['type' => 'credits']) }}";
            $('#purchasePackageLink').attr('href', baseUrl + '?tab=' + tabName);
            loadProperties();
        });
    })();

    // Existing dashboard scripts
    $(document).ready(function () {
        function loadDashboardSection(url) {
            $('#dashboard-content').html('<div class="text-center my-4"><i class="fas fa-spinner fa-spin fa-2x"></i><p class="mt-2">Loading content...</p></div>');
            $.get(url, function (data) {
                $('#dashboard-content').html(data);
            }).fail(function () {
                $('#dashboard-content').html('<div class="alert alert-danger text-center">Failed to load dashboard section.</div>');
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
        if (!url) return;
        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function () {
                $('#dashboard-content').html('<div class="text-center my-4"><i class="fa fa-spinner fa-spin"></i> Loading...</div>');
            },
            success: function (response) {
                $('#dashboard-content').html(response);
            },
            error: function (xhr, status, error) {
                $('#dashboard-content').html('<div class="alert alert-danger text-center">Failed to load content.</div>');
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
        }).fail(function (xhr, status, error) {
            $('#dashboard-content').html('<div class="alert alert-danger text-center">Failed to load content.</div>');
        });
    });

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
<script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
@endsection