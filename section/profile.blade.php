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
            width: 100px;
        }
        .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
            color: #ffffff;
            background-color: #163d75;
            border-color: var(--bs-nav-tabs-link-active-border-color);
        }
        .form-control {
            width: 100%;
            height: 40px;
            padding: 0 10px;
            border-radius: 5px;
            border: 1px solid #ced4da;
            background-color: transparent;
            color: var(--text-color);
        }
        .select2-container--default .select2-selection--single {
            background-color: #fff;
            border: 1px solid #aaa;
            border-radius: 4px;
            height: 37px;
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
                                <div class="row justify-content-center">

                                </div>
                            </div>
                            <div class="container">
                                <div class="row justify-content-center">
                                    <div class="col-md-10">
                                        <div class="col-12 pb-2">
                                        </div>
                                        <div class="tab-content" id="profileTabsContent">
                                            <!-- Update Profile Tab -->
                                            <div class="tab-pane fade show active mt-4" id="update" role="tabpanel" aria-labelledby="update-tab">
                                                <h2 class="text-2xl font-bold text-gray-800 py-2 mb-4" style="color: #163d75">Update Profile</h2>
                                                <form action="{{ route('customer.profile.update') }}" method="POST" enctype="multipart/form-data">
                                                    @csrf

                                                    @if (session('success'))
                                                        <div class="alert alert-success">
                                                            {{ session('success') }}
                                                        </div>
                                                    @endif

                                                    @if ($errors->any())
                                                        <div class="alert alert-danger">
                                                            <ul class="mb-0">
                                                                @foreach ($errors->all() as $error)
                                                                    <li>{{ $error }}</li>
                                                                @endforeach
                                                            </ul>
                                                        </div>
                                                    @endif

                                                    <div class="row g-4">
                                                        <div class="col-md-4">
                                                            <label for="first_name" class="form-label">First Name <span class="text-danger">*</span></label>
                                                            <input type="text" class="form-control" id="first_name" name="first_name" value="{{ $customer->first_name }}" maxlength="10" required>
                                                            @error('first_name')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="last_name" class="form-label">Last Name <span class="text-danger">*</span></label>
                                                            <input type="text" class="form-control" id="last_name" name="last_name" value="{{ $customer->last_name }}" maxlength="10" required>
                                                            @error('last_name')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="username" class="form-label">Username <span class="text-danger">*</span></label>
                                                            <input type="text" class="form-control" id="username" name="username" value="{{ $customer->username }}" maxlength="10" required>
                                                            @error('username')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="company" class="form-label">Company</label>
                                                            <input type="text" class="form-control" id="company" name="company" value="{{ $customer->company }}">
                                                            @error('company')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="phone" class="form-label">Phone</label>
                                                            <input type="text" class="form-control" id="phone" name="phone" value="{{ $customer->phone }}" readOnly>
                                                            @error('phone')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="email" class="form-label">Email</label>
                                                            <input type="email" class="form-control" id="email" name="email" value="{{ $customer->email }}" required readOnly>
                                                            @error('email')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="dob" class="form-label">Date of Birth</label>
                                                            <input type="date" class="form-control" id="dob" name="dob" value="{{ $customer->dob }}">
                                                            @error('dob')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <div class="col-md-4">
                                                            <label for="state" class="form-label">State</label>
                                                            <select id="state" name="state_id" class="form-select select2">
                                                                <option value="">Select State</option>
                                                                @foreach ($states as $state)
                                                                    <option value="{{ $state->id }}" {{ old('state_id', $customer->state_id) == $state->id ? 'selected' : '' }}>
                                                                        {{ $state->name }}
                                                                    </option>
                                                                @endforeach
                                                            </select>
                                                            @error('state_id')
                                                                <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>

                                                        <div class="col-md-4">
                                                            <label for="city" class="form-label">City</label>
                                                            <select id="city" name="city_id" class="form-select select2">
                                                                <option value="">Select City</option>
                                                                {{-- Empty initially; will be populated dynamically --}}
                                                            </select>
                                                            @error('city_id')
                                                                <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        <?php if($customer->avatar_image){?>
                                                        <div class="col-md-4">
                                                            <label class="form-label">Profile Image</label>
                                                            <div>
                                                                <img src="{{ asset('assets/images/profile-image/' . $customer->avatar_image) }}" alt="Profile Image" class="preview-img" width="100" height="100">
                                                            </div>
                                                        </div>
                                                        <?php }?>
                                                        <div class="col-md-4">
                                                            <label for="avatar_image" class="form-label">Profile Image</label>
                                                            <input type="file" class="form-control" id="avatar_image" name="avatar_image" accept="image/*">
                                                            <small class="text-muted">* image must be minimum 2MB</small>
                                                            @error('avatar_image')
                                                            <div class="text-danger">{{ $message }}</div>
                                                            @enderror
                                                        </div>
                                                        
                                                    </div>
                                                    <div class="mt-5 text-center">
                                                        <button type="submit" class="btn btn-outline-primary">Update Profile</button>
                                                    </div>
                                                </form>
                                            </div>
                                            <!-- Change Password Tab -->
                                            <div class="tab-pane fade  mt-4" id="password" role="tabpanel" aria-labelledby="password-tab">
                                                <h2 class="text-2xl font-bold text-gray-800 mb-4">Change Password</h2>
                                                <form id="passwordForm">
                                                    @csrf
                                                    @if (session('success'))
                                                        <div class="alert alert-success">
                                                            {{ session('success') }}
                                                        </div>
                                                    @endif

                                                    @if ($errors->any())
                                                        <div class="alert alert-danger">
                                                            <ul class="mb-0">
                                                                @foreach ($errors->all() as $error)
                                                                    <li>{{ $error }}</li>
                                                                @endforeach
                                                            </ul>
                                                        </div>
                                                    @endif

                                                    <div class="col-md-4 mb-4">
                                                        <label for="current_password" class="form-label">Current Password</label>
                                                        <input type="password" class="form-control" id="current_password" name="current_password" required>
                                                    </div>
                                                    <div class="col-md-4 mb-4">
                                                        <label for="new_password" class="form-label">New Password</label>
                                                        <input type="password" class="form-control" id="new_password" name="new_password" required>
                                                    </div>
                                                    <div class="col-md-4 mb-4">
                                                        <label for="new_password_confirmation" class="form-label">Confirm New Password</label>
                                                        <input type="password" class="form-control" id="new_password_confirmation" name="new_password_confirmation" required>
                                                    </div>
                                                    <div class="col-md-4 text-center">
                                                        <button type="submit" class="btn btn-outline-primary">Change Password</button>
                                                    </div>
                                                </form>
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
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
    </script>
    <script>
        document.getElementById('passwordForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const form = e.target;
            const formData = new FormData(form);

            fetch("{{ route('customer.profile.password') }}", {
                method: "POST",
                headers: {
                    'X-CSRF-TOKEN': '{{ csrf_token() }}',
                    'Accept': 'application/json'
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    // Clear previous errors
                    document.querySelectorAll('.text-danger').forEach(el => el.remove());

                    if (data.status) {
                        // Show success message (optional)
                        alert(data.message);

                        // Refresh page after short delay
                        setTimeout(() => {
                            location.reload();
                        }, 1000); // 1 second delay (optional)
                    } else {
                        if (data.errors) {
                            for (const [field, messages] of Object.entries(data.errors)) {
                                const input = document.getElementById(field);
                                if (input) {
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'text-danger mt-1';
                                    errorDiv.innerText = messages[0];
                                    input.parentNode.appendChild(errorDiv);
                                }
                            }
                        }
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    </script>
    <script>
        $(document).ready(function () {
           

            function loadCities(stateId, selectedCityId = null) {
                $('#city').empty().append('<option value="">Select City</option>');

                if (stateId) {
                    $.ajax({
                        url: '/getcities/' + stateId,
                        method: 'GET',
                        success: function (cities) {
                            $.each(cities, function (i, city) {
                                const selected = (selectedCityId == city.id) ? 'selected' : '';
                                $('#city').append(`<option value="${city.id}" ${selected}>${city.name}</option>`);
                            });

                            $('#city').trigger('change'); // Refresh select2
                        },
                        error: function () {
                            alert('Failed to load cities.');
                        }
                    });
                }
            }

            // Initial load (edit form)
            const stateId = "{{ old('state_id', $customer->state_id) }}";
            const cityId = "{{ old('city_id', $customer->city_id) }}";
            if (stateId) {
                loadCities(stateId, cityId);
            }

            // On change
            $('#state').on('change', function () {
                const stateId = $(this).val();
                loadCities(stateId);
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